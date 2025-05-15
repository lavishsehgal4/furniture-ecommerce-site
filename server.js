const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session"); // Import express-session
const nodemailer = require("nodemailer");

mongoose
  .connect("mongodb://127.0.0.1:27017/furnitureGallery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const User = require("./models/User"); // assuming user.js is your model file
const Cart = require("./models/Cart");
const Subscriber = require("./models/Subscriber");
const HelpRequest = require("./models/HelpRequest"); // adjust path as needed
const DesignConsult = require("./models/DesignConsult");

const featuredProducts = require("./data/featuredProducts");
const categories = require("./data/categories");
const {
  products: bedroomProducts,
  trending: bedroomTrending,
  trending,
} = require("./data/bedroomProducts");
const {
  products: diningProducts,
  trending: diningTrending,
} = require("./data/diningProducts");
const {
  products: livingProducts,
  trending: livingTrending,
} = require("./data/livingProducts");
const allProducts = require("./data/allProducts");

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, "clients.json");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // only if your views are in a /views folder
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Use morgan middleware
app.use(morgan("combined", { stream: accessLogStream }));
// Middleware to parse form data (JSON & URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// In-memory session configuration
app.use(
  session({
    secret: "yourSecretKey", // Secret to sign the session ID
    resave: false, // Do not save session if not modified
    saveUninitialized: false, // Do not save an uninitialized session
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration for session cookie
    },
  })
);

// Serve static files from "public" folder
const publicPath = path.join(__dirname, "public");
console.log("Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Middleware to redirect to dashboard if already logged in
function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/dashboard");
  }
  next();
}

// Routes to serve HTML pages
app.get("/", (req, res) => {
  res.render("home", { featuredProducts, categories });
});

app.get("/login", redirectIfLoggedIn, (req, res) =>
  res.render("login", { title: "Login Page" })
);

app.get("/wishlist", redirectIfLoggedIn, (req, res) =>
  res.render("wishlist", { title: "Login Page" })
);

app.get("/CreateAccount", (req, res) =>
  res.render("createAccount", { title: "Create Account" })
);
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("dashboard", { user: req.session.user });
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.get("/dining", (req, res) => {
  res.render("dining", {
    products: diningProducts,
    trending: diningTrending,
  });
});

app.get("/bedroom", (req, res) => {
  res.render("bedroom", {
    products: bedroomProducts,
    trending: bedroomTrending,
  });
});

app.get("/shop", (req, res) => {
  const { bedroom, dining, living } = allProducts;
  const product = [...bedroom.products, ...dining.products, ...living.products];
  const trend = [...bedroom.trending, ...dining.trending, ...living.trending];
  res.render("shop", {
    products: product,
    trending: trend,
  });
});

app.get("/living", (req, res) => {
  res.render("living", { products: livingProducts, trending: livingTrending });
});
app.get("/search", (req, res) => {
  res.render("searchbar");
});

app.get("/feature/:id", (req, res, next) => {
  const { id } = req.params;
  const product = featuredProducts.find((p) => p.id === id);

  if (!product) {
    const error = new Error("Featured product not found");
    error.status = 404;
    return next(error);
  }
  res.render("product", { product, trending: null });
});

app.get("/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const categoryData = allProducts[category];

  if (!categoryData) {
    return res.status(404).send("Category not found");
  }

  let product = categoryData.products.find((p) => String(p.id) === id);

  let trending;
  if (!product) {
    trending = categoryData.trending.find((p) => String(p.id) === id);
    if (trending) {
      product = trending;
    }
    if (!trending) {
      return res.status(404).send("Product not found");
    }
  }

  res.render("product", { product, trending });
});

app.get("/cart", async (req, res) => {
  if (!req.session.user) {
    return res.render("cartWithoutLogin");
  }

  try {
    const userEmail = req.session.user.email;
    const cartItems = await Cart.find({ email: userEmail });

    res.render("cart", { cartItems, user: req.session.user });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/location", (req, res) => {
  res.render("location");
});

app.get("/book", (req, res) => res.render("designConsult"));
// Route to register new users
app.post("/saveUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({
      message: "Account created successfully!",
      id: newUser._id,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare password directly (NOT RECOMMENDED)
    if (password !== user.password) {
      return res.status(401).send("Invalid email or password");
    }

    // Store user data in session after successful login
    req.session.user = {
      name: user.name,
      email: user.email,
      role: user.role || "customer", // Default role if not present
    };

    // Redirect to a protected route after login
    res.redirect("/"); // Change this to any route you want to redirect the user to
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try again later.");
  }
});

//add to cart

app.post("/add-to-cart", async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to add to cart." });
  }

  const { id, category, name, price, description } = req.body;
  const image = req.body.image;

  const cartItem = new Cart({
    email: req.session.user.email,
    product: { id, category, image, name, price, description },
  });

  try {
    await cartItem.save();
    res.json({ message: "✅ Item added to cart!" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "❌ Server error. Try again later." });
  }
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).send("Please provide a valid email.");
  }

  try {
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(409).send("You're already subscribed.");
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send confirmation email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sehgallavish08@gmail.com", // your Gmail
        pass: "fmoy xpjn pxhw yjmb", // App Password (not your real password)
      },
    });

    const mailOptions = {
      from: '"The Furniture Gallery" <sehgallavish08@gmail.com>',
      to: email,
      subject: "Welcome to The Furniture Gallery!",
      text: `Hi there,

Thank you for subscribing to The Furniture Gallery! We’re excited to have you join our community.

You’ll now be the first to know about new arrivals, exclusive discounts, and more.

Best regards,
The Furniture Gallery Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Thank you for joining the family!");
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).send("Server error. Try again later.");
  }
});

app.post("/help", async (req, res) => {
  const { name, email, phone, postcode, message, agreedToTerms } = req.body;

  if (!name || !email || !phone || !message || !agreedToTerms) {
    return res.status(400).send("Please fill in all required fields.");
  }

  try {
    const newHelpRequest = new HelpRequest({
      name,
      email,
      phone,
      postcode,
      message,
      agreedToTerms,
    });

    await newHelpRequest.save();
    res.status(200).send("Your message has been received.");
  } catch (err) {
    console.error("Error submitting help request:", err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

app.post("/book-consult", async (req, res) => {
  const { name, date, time } = req.body;

  // Prevent double booking
  const alreadyBooked = await DesignConsult.findOne({ date, time });
  if (alreadyBooked) {
    return res.status(409).send("This time slot is already booked.");
  }

  const newBooking = new DesignConsult({ name, date, time });

  try {
    await newBooking.save();
    res.status(201).send("Booking confirmed!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error. Please try again.");
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    const userEmail = req.session?.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: "Login required" });
    }

    const result = await Cart.deleteOne({
      _id: req.params.id,
      email: userEmail,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found or unauthorized" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Error handling

app.get(/.*/, (req, res, next) => {
  const error = new Error("Endpoint Not Found");
  error.status = 404;
  return next(error);
});

// Error handling middleware for all routes
app.use((err, req, res, next) => {
  // Check for a specific error and render the error page with details
  if (err.status === 404) {
    res.status(404).render("error", {
      errorMessage: "Page Not Found",
      errorDetails:
        err.message || "The page you are looking for does not exist.",
    });
  } else {
    // For other errors, return a generic error message
    res.status(err.status || 500).render("error", {
      errorMessage: "Something Went Wrong",
      errorDetails: err.message || "An unexpected error occurred.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
