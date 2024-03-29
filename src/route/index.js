// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (
    id,
    { price, name, description },
  ) => {
    const product = this.getById(id)

    if (product) {
      if (price) {
        product.price = price
      }

      if (name) {
        product.name = name
      }

      if (description) {
        product.description = description
      }

      return true
    } else {
      return false
    }
  }
}
//=================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

//=================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  console.log(id)
  const product = Product.getById(Number(id))
  console.log(product)

  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  console.log(name, price, description, id)

  const result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  res.render('alertEdit', {
    style: 'alertEdit',
    info: result,
  })
})

//=================================================================

router.get('/product-list', function (req, res) {
  //   // res.render генерує нам HTML сторінку

  const list = Product.getList()

  //   // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    //     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  //   // ↑↑ сюди вводимо JSON дані
})

//=================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
  })
})

//=================================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()

  res.render('alert', {
    style: 'alert',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

//=================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-delete', {
    style: 'product-delete',
  })
})

//=================================================================

// Підключаємо роутер до бек-енду
module.exports = router
