import { Product, BlogPost, Review, Order } from './types';

export const CATEGORIES = [
  {
    id: 'cakes',
    name: 'Cakes',
    description: 'Exquisite multi-layer cakes, custom birthday treats, and velvety creations for celebrations.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    count: 3
  },
  {
    id: 'breads',
    name: 'Breads',
    description: 'Freshly baked sourdough, baguettes, and hearty loaves using traditional slow-fermentation methods.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
    count: 1
  },
  {
    id: 'pastries',
    name: 'Pastries',
    description: 'Buttery, flaky croissants, danishes, and elegant sweet tarts prepared fresh every morning.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    count: 4
  },
  {
    id: 'custom-orders',
    name: 'Custom Orders',
    description: 'Work with our master bakers to craft the perfect custom cake, bespoke pastry selection, or corporate gift packages.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600',
    count: 4
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Signature Wild Sourdough',
    category: 'breads',
    price: 8.50,
    description: 'Our standard 36-hour slow-fermented classic country sourdough with a blistered crust and open, airy crumb.',
    longDescription: 'Crafted using our 50-year-old sourdough starter "Gertrude," this loaf is a testament to the art of traditional baking. We use only organic, stone-ground high-protein flour, water, and sea salt. The extended cold fermentation process breaks down gluten, making it gentler on digestion and infusing it with a complex, mildly tangy flavor profile that pairs wonderfully with salted butter or gourmet cheeses.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['vegan', 'organic'],
    rating: 4.9,
    reviewsCount: 124,
    sizes: ['Standard Loaf (800g)', 'Large Family Loaf (1.2kg)'],
    flavors: ['Classic Country', 'Rosemary Garlic', 'Walnut Cranberry'],
    ingredients: ['Organic Wheat Flour', 'Water', 'Levain (Starter)', 'French Sea Salt'],
    nutritionalInfo: {
      calories: 185,
      fat: '0.8g',
      carbs: '37g',
      protein: '6.2g'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: '2',
    name: 'Triple Chocolate Ganache Cake',
    category: 'cakes',
    price: 45.00,
    description: 'Decadent dark chocolate sponge layered with creamy milk chocolate mousse and glazed with shiny dark chocolate ganache.',
    longDescription: 'The ultimate celebration for chocolate purists. This cake features three layers of moist, dark Valrhona chocolate cake, filled with airy Belgian milk chocolate mousse, and enveloped in a silky, rich 70% dark chocolate ganache glaze. Decorated elegantly with hand-rolled chocolate curls and a touch of edible gold leaf.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: [],
    rating: 4.8,
    reviewsCount: 88,
    sizes: ['6-inch (Serves 6-8)', '8-inch (Serves 10-12)', '10-inch (Serves 16-20)'],
    flavors: ['Classic Double Chocolate', 'Chocolate Raspberry Fudge', 'Chocolate Salted Caramel'],
    ingredients: ['Dark Valrhona Chocolate', 'Organic Butter', 'Pasture-Raised Eggs', 'Heavy Cream', 'Unbleached Cake Flour', 'Cane Sugar', 'Espresso Powder'],
    nutritionalInfo: {
      calories: 340,
      fat: '18g',
      carbs: '42g',
      protein: '5g'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: '3',
    name: 'French Butter Almond Croissant',
    category: 'pastries',
    price: 5.25,
    description: 'Double-baked traditional French croissant filled with sweet almond frangipane and topped with toasted flaked almonds.',
    longDescription: 'Our signature croissant is laminated with premium AOP Charentes-Poitou French butter over three days to create 27 crispy, airy layers. For our Almond version, we slice the fresh baked croissants, brush them lightly with rum syrup, stuff them with our homemade vanilla bean almond frangipane, and bake them a second time until golden and crunchy. Finished with powdered sugar.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1623334024219-c116919990b2?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['eggless'],
    rating: 4.9,
    reviewsCount: 156,
    sizes: ['Single Pastry', 'Box of 4', 'Box of 8'],
    ingredients: ['French Pastry Flour', 'AOP Butter', 'Almond Meal', 'Vanilla Bean', 'Organic Sugar', 'Slivered Almonds', 'Sea Salt'],
    nutritionalInfo: {
      calories: 295,
      fat: '16g',
      carbs: '31g',
      protein: '7g'
    },
    featured: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Gluten-Free Raspberry Velvet Cake',
    category: 'cakes',
    price: 48.00,
    description: 'Rich, moist gluten-free cake infused with real raspberry puree, layered with light vanilla cream cheese frosting.',
    longDescription: 'A heavenly dessert designed for everyone. We use a proprietary blend of almond flour, coconut flour, and sweet white rice flour to achieve a incredibly tender, moist crumb. No artificial coloring here—the beautiful red hue comes entirely from pureed fresh organic raspberries and beet juice concentrate. Layered with luxury whipped organic cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464349110291-1413b70d763e?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['gluten-free', 'organic'],
    rating: 4.7,
    reviewsCount: 42,
    sizes: ['6-inch (Serves 6-8)', '8-inch (Serves 10-12)'],
    ingredients: ['Almond Flour', 'Organic Raspberry Puree', 'Cream Cheese', 'Beet Juice Extract', 'Pasture-Raised Eggs', 'Tapioca Starch', 'Coconut Sugar'],
    nutritionalInfo: {
      calories: 270,
      fat: '12g',
      carbs: '34g',
      protein: '6g'
    },
    featured: false,
    isNew: true
  },
  {
    id: '5',
    name: 'Zesty Lemon Elderflower Tart',
    category: 'pastries',
    price: 6.00,
    description: 'Crisp shortbread pastry shell filled with tangy lemon-lime curd, infused with sweet elderflower syrup.',
    longDescription: 'A bright, floral, and intensely refreshing pastry. Our sweet pâte sablée crust is baked to crisp, golden-brown perfection, then filled with a creamy, intensely zesty lemon curd that has been delicately infused with elderflower cordial. Beautifully garnished with piped Swiss meringue kisses, candied lemon peel, and organic edible flower petals.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: [],
    rating: 4.6,
    reviewsCount: 39,
    sizes: ['Single Tart (4")', 'Sharing Tart (9")'],
    ingredients: ['Organic Lemons', 'Elderflower Extract', 'Organic Butter', 'Pasture-Raised Eggs', 'Unbleached Flour', 'Sugar', 'Cream of Tartar'],
    nutritionalInfo: {
      calories: 210,
      fat: '9g',
      carbs: '28g',
      protein: '3g'
    },
    featured: false
  },
  {
    id: '6',
    name: 'Vegan Salted Pecan Cinnamon Roll',
    category: 'pastries',
    price: 5.50,
    description: 'Soft, fluffy vegan brioche dough rolled with Ceylon cinnamon, organic brown sugar, topped with cream cheese glaze and roasted pecans.',
    longDescription: 'Our award-winning giant cinnamon rolls are 100% plant-based! We use coconut oil and premium almond milk to make a rich, pillow-soft dough. Every roll is layered generously with aromatic ground Ceylon cinnamon and caramelized dark brown sugar, then topped with a luscious glaze made from house-made vegan cream cheese, finished with toasted salted pecans.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['vegan', 'organic'],
    rating: 4.9,
    reviewsCount: 147,
    sizes: ['Single Roll', 'Box of 4', 'Box of 6'],
    ingredients: ['Organic Wheat Flour', 'Almond Milk', 'Coconut Oil', 'Ceylon Cinnamon', 'Brown Cane Sugar', 'Maple Syrup', 'Georgia Pecans', 'Vegan Cream Cheese'],
    nutritionalInfo: {
      calories: 310,
      fat: '11g',
      carbs: '46g',
      protein: '5.2g'
    },
    bestSeller: true
  },
  {
    id: '7',
    name: 'Eggless Pistachio Cardamom Dream',
    category: 'cakes',
    price: 49.00,
    description: 'Delicate eggless cake with roasted Sicilian pistachios, scented with freshly ground green cardamom and rosewater syrup.',
    longDescription: 'An aromatic cake celebrating Middle Eastern flavors, made completely egg-free using organic Greek yogurt as a binder. The cake is incredibly moist and dense, infused with ground premium green cardamom pods, layered with a silky Sicilian pistachio buttercream and brushed with a subtle organic damask rosewater glaze. Gilded with crushed vibrant green pistachios and dried culinary rose petals.',
    image: 'https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518047601542-79f18c655718?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['eggless', 'organic'],
    rating: 4.8,
    reviewsCount: 65,
    sizes: ['6-inch (Serves 6-8)', '8-inch (Serves 10-12)'],
    ingredients: ['Greek Yogurt', 'Ground Pistachios', 'Green Cardamom', 'Rosewater Cordial', 'Wheat Flour', 'Unsalted Butter', 'Organic Powdered Sugar'],
    nutritionalInfo: {
      calories: 320,
      fat: '14g',
      carbs: '39g',
      protein: '6.5g'
    },
    featured: true
  },
  {
    id: '8',
    name: 'Spiced Pumpkin Bourbon Pie',
    category: 'pastries',
    price: 28.00,
    description: 'Holiday special silky smooth roasted pumpkin filling spiced with ginger, clove, and nutmeg, spiked with high-quality bourbon in a flaky butter crust.',
    longDescription: 'Our signature autumn pie! We roast organic sugar pumpkins in-house until caramelized, then blend them with rich cream, farm-fresh eggs, our custom spice mix, and a splash of Kentucky straight bourbon whiskey. Baked in our hyper-flaky 100-layer butter crust. Served with a piping of maple whipped cream.',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: [],
    rating: 4.7,
    reviewsCount: 54,
    sizes: ['Whole Pie (9" - Serves 8)'],
    ingredients: ['Roasted Sugar Pumpkin', 'Pure Butter Crust', 'Fresh Cream', 'Eggs', 'Kentucky Bourbon', 'Nutmeg', 'Ginger', 'Cinnamon', 'Clove', 'Maple Syrup'],
    nutritionalInfo: {
      calories: 245,
      fat: '10g',
      carbs: '32g',
      protein: '4.5g'
    },
    featured: false
  },
  {
    id: '9',
    name: 'Bespoke Celebration Cake Builder',
    category: 'custom-orders',
    price: 65.00,
    description: 'Design your dream cake. Select your sponges, premium fillings, hand-piped frostings, and custom birthday lettering.',
    longDescription: 'Collaborate with our master cake designers to create the perfect centerpiece for your wedding, birthday, or graduation. Choose from organic vanilla sponge, decadent dark chocolate, or moist red velvet. Pair them with fresh fruit preserves, Belgian chocolate mousse, or lemon curd, and specify your exact color palette and hand-written messaging.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464349110291-1413b70d763e?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['organic'],
    rating: 5.0,
    reviewsCount: 18,
    sizes: ['6-inch (Serves 6-8)', '8-inch (Serves 10-12)', '10-inch (Serves 16-20)', '12-inch Tiered (Serves 30+)'],
    flavors: ['Vanilla Bean & Strawberry', 'Double Chocolate Fudge', 'Red Velvet Cream Cheese', 'Lemon Raspberry Swirl'],
    ingredients: ['Organic Wheat Flour', 'Pasture-Raised Eggs', 'Whipped Cream', 'Cane Sugar', 'Butter', 'Natural Madagascar Vanilla Extracts'],
    nutritionalInfo: {
      calories: 290,
      fat: '11g',
      carbs: '36g',
      protein: '4.8g'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: '10',
    name: 'Bespoke Pastry Catering Platter',
    category: 'custom-orders',
    price: 55.00,
    description: 'A custom curated platter of 12 or 24 of our signature croissants, danishes, tarts, and morning buns for your event.',
    longDescription: 'Impress your guests, coworkers, or clients with a gorgeous display of our finest freshly baked French pastries. Placed beautifully in our wooden catering trays. You can select an all-sweet collection, savory & flaky bakes, or a baker\'s selected assortment. Baked fresh at 3:00 AM on the day of your event.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: [],
    rating: 4.9,
    reviewsCount: 22,
    sizes: ['Small Platter (12 Pastries)', 'Large Platter (24 Pastries)'],
    flavors: ["Baker's Assorted Mix", "Sweet Pastry Focused", "Savory & Flaky Mix"],
    ingredients: ['French Pastry Flour', 'AOP Charentes Butter', 'Fresh Fruits', 'Vanilla Custard', 'Sourdough Starter'],
    nutritionalInfo: {
      calories: 250,
      fat: '12g',
      carbs: '29g',
      protein: '5.0g'
    },
    featured: true,
    isNew: true
  },
  {
    id: '11',
    name: 'Custom Wedding Tasting Consultation',
    category: 'custom-orders',
    price: 40.00,
    description: 'Order a custom curated wedding cake tasting box featuring 4 cake flavors and 4 frostings, paired with a 30-min master baker consultation.',
    longDescription: 'Plan your magical wedding cake with confidence. This package includes a premium tasting box containing individual slices of our four most celebrated wedding cake recipes, along with samples of fillings and gourmet frostings. Comes with a private 30-minute virtual or in-person design consultation with our Head Pastry Chef to map out your dream cake tiering, styling, and floral details.',
    image: 'https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['organic'],
    rating: 5.0,
    reviewsCount: 14,
    sizes: ['Tasting Box (For 2)', 'Tasting Box (For 4)'],
    flavors: ['Premium Floral Flavor Pack', 'Classic Decadence Pack'],
    ingredients: ['Varies by cake selection'],
    nutritionalInfo: {
      calories: 210,
      fat: '8g',
      carbs: '30g',
      protein: '3.5g'
    },
    featured: false,
    isNew: true
  },
  {
    id: '12',
    name: 'Artisanal Bread Gift Basket',
    category: 'custom-orders',
    price: 35.00,
    description: 'A beautifully arranged rustic basket containing 3 signature loaves of sourdough, artisanal preserves, and whipped specialty butter.',
    longDescription: 'The perfect gourmet gift for the food lover in your life. This hand-woven picnic basket is packed with a freshly baked Classic Country Sourdough, a Rosemary Garlic Sourdough, a Cranberry Walnut Sourdough, plus a jar of house-made organic strawberry-basil preserve and a tub of french sea-salted whipped butter.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
    ],
    dietary: ['vegan', 'organic'],
    rating: 4.9,
    reviewsCount: 31,
    sizes: ['Standard Gift Basket', 'Deluxe Celebration Basket'],
    flavors: ['Classic Sourdough Mix', 'Herbs & Fruit Infused Mix'],
    ingredients: ['Organic Wheat Flour', 'French Butter', 'Fresh Strawberries', 'Basil', 'French Sea Salt'],
    nutritionalInfo: {
      calories: 190,
      fat: '2.5g',
      carbs: '38g',
      protein: '5.8g'
    },
    featured: false,
    bestSeller: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    author: 'Eleanor Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    date: '2026-06-15',
    title: 'The crust of my dreams!',
    comment: 'The sourdough is out of this world. Perfectly crunchy crust on the outside, and incredibly soft, chewable, and flavorful on the inside. My family eats a loaf of this every two days. It makes the most incredible avocado toast you will ever eat!',
    verified: true,
    likes: 24
  },
  {
    id: 'r2',
    productId: '2',
    author: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    date: '2026-06-20',
    title: 'The best birthday cake ever!',
    comment: 'I ordered the Triple Chocolate Ganache cake for my wife’s 40th birthday. It was a massive hit! Not overly sweet, intensely chocolatey, and beautifully decorated. Everyone asked where we got it from. Customer service was excellent too!',
    verified: true,
    likes: 18
  },
  {
    id: 'r3',
    productId: '3',
    author: 'Chloe Dupont',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    date: '2026-06-22',
    title: 'Authentic French taste!',
    comment: 'Having lived in Paris for 5 years, I can confidently say this is the best almond croissant in the city. The layering is incredible, and the frangipane filling has the perfect texture and almond depth without being sickly sweet.',
    verified: true,
    likes: 31
  },
  {
    id: 'r4',
    productId: '6',
    author: 'Samantha Reyes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    date: '2026-06-24',
    title: 'Mindblown by the vegan brioche',
    comment: 'As a vegan, finding pastries that match the dairy version is hard. This cinnamon roll is actually BETTER. It is so giant, moist, fluffy, and the pecans add the most delicious savory crunch. Will buy weekly!',
    verified: true,
    likes: 12
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Secrets to a Perfect Sourdough Crust at Home',
    excerpt: 'Want to achieve that golden, bubbly, crisp crust? We break down our top three professional tips for home bakers.',
    content: `Achieving that beautiful, blistered, crunchy artisanal crust at home can feel like a mystery. But with three simple adjustments, you can elevate your bread from flat to fabulous.\n\nFirst, **moisture is key**. Professional ovens inject steam during the first 10-15 minutes of baking, which keeps the dough\'s surface flexible, allowing it to rise fully (the "oven spring") before the crust sets. At home, you can replicate this by using a preheated heavy cast-iron Dutch oven with the lid on. The lid traps the bread\'s own evaporating moisture, creating a perfect mini steam chamber.\n\nSecond, **fermentation time**. A cold fermentation in the refrigerator (retardation) for 12-24 hours before baking allows sugars to concentrate on the surface of the dough. During baking, these sugars caramelize, forming a deeper, more flavorful brown color with signature bubbles.\n\nLastly, **bake it hot**. Start your oven at 500°F (260°C) with the Dutch oven inside, then drop it to 450°F (230°C) when you load the dough. This high initial thermal shock initiates a rapid expansion, cracking open the score lines beautifully. Happy baking!`,
    author: 'Head Baker Evelyn Stone',
    date: 'June 18, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
    category: 'Baking Tips'
  },
  {
    id: 'b2',
    title: 'A Guide to Natural Sweeteners in Pastries',
    excerpt: 'Ditch the refined sugar. Discover how maple syrup, coconut sugar, and dates change the flavor profile of your cakes.',
    content: `When baking, sugar isn\'t just about sweetness—it plays a vital structural role. It tenderizes the crumb, locks in moisture, and aids in browning. However, using natural alternatives like maple syrup, raw honey, coconut sugar, or date paste can bring exciting, earthier flavor notes while keeping things less refined.\n\n**Coconut Sugar:** This is a 1-to-1 dry substitute for granulated or brown sugar. It has a beautiful, rich caramel flavor, which works wonders in cookies, gingerbreads, and chocolate cakes. It also has a lower glycemic index.\n\n**Maple Syrup:** Best used in quick breads, tarts, and glazes. Because it is liquid, you must reduce other liquids in your recipe by about 1/4 cup for every cup of maple syrup used, and bake at 25°F lower to prevent burning.\n\n**Date Paste:** Made by blending soaked Medjool dates, this is a fiber-rich sweetener perfect for dense muffins or vegan crusts. It adds a deep molasses vibe that pairs wonderfully with warm spices.`,
    author: 'Pastry Chef Leo Mercier',
    date: 'June 12, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    category: 'Ingredients'
  },
  {
    id: 'b3',
    title: 'Behind the Scenes: A Day in the Life at Bread N Cakes',
    excerpt: 'Peek inside the bakery starting at 3:00 AM as we fire up the stone hearth and laminate hundreds of croissants.',
    content: `While the city sleeps, our bakery comes alive. The daily dance of flour, water, and yeast begins at exactly 3:00 AM.\n\nFirst, Head Baker Evelyn arrives to check the ambient humidity and check on "Gertrude," our 50-year-old sourdough starter. The levain is mixed, and doughs are shaped to go directly into the stone-hearth ovens, which have been preheating for hours.\n\nAt 4:00 AM, our laminator expert starts rolling out chilled butter blocks into flaky pastry doughs, creating the pristine layers that make our croissants so famously airy.\n\nBy 6:00 AM, the comforting aroma of baked rye and warm cinnamon starts wafting down the street. Our delivery vans are loaded, the display racks are stacked, and the espresso machine is primed. At exactly 7:00 AM, we flip the sign to "Open," ready to serve you the freshest bites of the day. It is hard work, but seeing your smiles makes every early hour worth it!`,
    author: 'Founder Maria Ross',
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    category: 'Our Story'
  }
];

export const FAQS = [
  {
    category: 'Ordering & Delivery',
    question: 'How far in advance do I need to place an order?',
    answer: 'For our daily baked breads and pastries, you can order for same-day pickup or local delivery! For custom celebration cakes or large event orders, we require at least 48 hours notice to ensure our pastry chefs have ample time to craft and decorate your creation.'
  },
  {
    category: 'Ordering & Delivery',
    question: 'Do you offer local delivery?',
    answer: 'Yes! We offer contactless local delivery within a 15-mile radius of our bakery. Delivery is free for orders over $40, and costs a flat $5 fee for smaller orders. You can select your preferred delivery date and a 2-hour time slot during checkout.'
  },
  {
    category: 'Dietary & Ingredients',
    question: 'Are your gluten-free products safe for Celiacs?',
    answer: 'While we take extreme care to prevent cross-contamination by sanitizing equipment and baking gluten-free items during dedicated shifts, we are not a certified gluten-free facility. We bake flour-based products in the same kitchen, so trace amounts of airborne flour may be present. If you have severe Celiac disease, we advise caution.'
  },
  {
    category: 'Dietary & Ingredients',
    question: 'Do you have eggless or vegan options?',
    answer: 'Absolutely! We have a dedicated range of delicious eggless and 100% plant-based vegan products, including our best-selling Vegan Salted Pecan Cinnamon Roll and our Eggless Pistachio Cardamom Dream Cake. These are marked with clear labels in our shop.'
  },
  {
    category: 'Storage & Freshness',
    question: 'How should I store my artisanal bread?',
    answer: 'Our artisanal breads contain no artificial preservatives! Store them cut-side down on a wooden cutting board or in a paper bread bag at room temperature for up to 3 days. Do not store bread in plastic bags or the refrigerator, as this accelerates staling. For long-term storage, slice the loaf, seal in a freezer bag, and freeze for up to 3 months. Toast slices directly from freezer!'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'Ethereal White Rose Wedding Cake',
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g2',
    title: 'Crusty Stone-Hearth Loaves',
    category: 'daily',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g3',
    title: 'Flaky Golden Croissant Selection',
    category: 'daily',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g4',
    title: 'Whimsical Safari Birthday Cake',
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g5',
    title: 'Seasonal Fruit & Custard Danish',
    category: 'daily',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g6',
    title: 'Minimalist Eucalyptus Tiered Cake',
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g7',
    title: 'Elegant Petite Raspberry Tartlets',
    category: 'daily',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'g8',
    title: 'Vibrant Galaxy Glazed Donuts',
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=500'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'BNC-48902',
    date: '2026-06-27',
    status: 'Baking',
    items: [
      {
        productId: '1',
        name: 'Signature Wild Sourdough',
        quantity: 1,
        price: 8.50,
        size: 'Standard Loaf (800g)',
        flavor: 'Classic Country',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=150'
      },
      {
        productId: '3',
        name: 'French Butter Almond Croissant',
        quantity: 2,
        price: 5.25,
        size: 'Single Pastry',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=150'
      }
    ],
    total: 24.00,
    paymentMethod: 'Visa ending in 4242',
    deliveryType: 'delivery',
    shippingAddress: {
      name: 'Samantha Reyes',
      street: '452 Elm Street, Apt 3B',
      city: 'San Francisco',
      zipCode: '94102',
      phone: '(555) 019-2834'
    },
    trackingSteps: [
      { title: 'Order Received', description: 'We have received your order and payment.', time: '08:30 AM', status: 'complete' },
      { title: 'Baking', description: 'Our bakers are currently baking and laminating your treats fresh.', time: '10:45 AM', status: 'current' },
      { title: 'Decorating & Packing', description: 'Adding any final glazes and packing in our bio-degradable boxes.', status: 'upcoming' },
      { title: 'Out for Delivery', description: 'Our friendly local courier is delivering to your address.', status: 'upcoming' },
      { title: 'Delivered', description: 'Handed directly to you or placed in a secure spot.', status: 'upcoming' }
    ]
  },
  {
    id: 'BNC-32401',
    date: '2026-06-10',
    status: 'Delivered',
    items: [
      {
        productId: '2',
        name: 'Triple Chocolate Ganache Cake',
        quantity: 1,
        price: 45.00,
        size: '8-inch (Serves 10-12)',
        flavor: 'Chocolate Salted Caramel',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=150'
      }
    ],
    total: 50.00,
    paymentMethod: 'Apple Pay',
    deliveryType: 'pickup',
    trackingSteps: [
      { title: 'Order Received', description: 'We have received your order.', time: 'Jun 08, 02:15 PM', status: 'complete' },
      { title: 'Baking', description: 'Preparing the custom chocolate cake sponge.', time: 'Jun 09, 09:00 AM', status: 'complete' },
      { title: 'Decorating', description: 'Adding rich chocolate curls and gold foil glaze.', time: 'Jun 09, 04:30 PM', status: 'complete' },
      { title: 'Ready for Pickup', description: 'Chilled and waiting in our display fridge.', time: 'Jun 10, 08:00 AM', status: 'complete' },
      { title: 'Delivered', description: 'Picked up by client with a warm smile.', time: 'Jun 10, 11:30 AM', status: 'complete' }
    ]
  }
];
