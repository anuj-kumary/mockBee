import {
  addItemToCartHandler,
  getCartItemsHandler,
  removeItemFromCartHandler,
  updateCartItemHandler,
} from "./backend/controllers/CartController";
import {
  addItemToWishListHandler,
  getWishListItemsHandler,
  removeItemFromWishListHandler,
} from "./backend/controllers/WishListController";
import { Server, Model, RestSerializer } from "miragejs";
import { products } from "./backend/db/products";
import { users } from "./backend/db/users";
import {
  loginHandler,
  signupHandler,
  logoutHandler
} from "./backend/controllers/AuthController";
import {
  getAllProductsHandler,
  getProductHandler,
} from "./backend/controllers/ProductController";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    serializers: {
      application: RestSerializer,
    },
    environment,
    models: {
      product: Model,
      wishList: Model,
      cart: Model,
      user: Model,
    },

    // Runs on the start of the server
    seeds(server) {
      products.forEach((item) => {
        server.create("product", { ...item });
      });

      users.forEach((item) =>
        server.create("user", { ...item, cart: [], wishList: [] })
      );
    },

    routes() {
      this.namespace = "api";
      // auth routes (public)
      this.post("/auth/signup", signupHandler.bind(this));
      this.post("/auth/login", loginHandler.bind(this));
      this.post("/auth/logout", logoutHandler.bind(this));

      // products routes (public)
      this.get("/products", getAllProductsHandler.bind(this));
      this.get("/products/:productId", getProductHandler.bind(this));

      // cart routes (private)
      this.get("/user/cart", getCartItemsHandler.bind(this));
      this.post("/user/cart", addItemToCartHandler.bind(this));
      this.delete("/user/cart", removeItemFromCartHandler.bind(this));
      this.post("/user/cart/:productId", updateCartItemHandler.bind(this));

      // wishlist routes (private)
      this.get("/user/wishlist", getWishListItemsHandler.bind(this));
      this.post("/user/wishlist", addItemToWishListHandler.bind(this));
      this.delete("/user/wishlist", removeItemFromWishListHandler.bind(this));
    },
  });
  return server;
}
