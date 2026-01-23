export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

export const categories = [
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Main Dishes" },
  { id: "drinks", name: "Drinks" },
  { id: "desserts", name: "Desserts" },
]

export const products: Product[] = [
  // Starters
  {
    id: "1",
    name: "Bruschetta",
    description: "Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil",
    price: 8.50,
    category: "starters",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Calamari Fritti",
    description: "Crispy fried calamari served with lemon aioli",
    price: 12.00,
    category: "starters",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
    price: 10.50,
    category: "starters",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop",
  },
  // Main Dishes
  {
    id: "4",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce, served with seasonal vegetables",
    price: 24.00,
    category: "mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Ribeye Steak",
    description: "12oz ribeye cooked to perfection with garlic herb butter",
    price: 32.00,
    category: "mains",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and parmesan",
    price: 18.00,
    category: "mains",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara sauce and melted mozzarella",
    price: 20.00,
    category: "mains",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop",
  },
  // Drinks
  {
    id: "8",
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh mint",
    price: 4.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
  },
  {
    id: "9",
    name: "Sparkling Water",
    description: "San Pellegrino sparkling mineral water",
    price: 3.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop",
  },
  {
    id: "10",
    name: "Red Wine",
    description: "Glass of house Cabernet Sauvignon",
    price: 9.00,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
  },
  // Desserts
  {
    id: "11",
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 9.00,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
  },
  {
    id: "12",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 10.00,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
  },
  {
    id: "13",
    name: "Panna Cotta",
    description: "Italian cream dessert with berry compote",
    price: 8.00,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
  },
]

export const restaurant = {
  name: "La Tavola",
  logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
  tableNumber: 4,
}
