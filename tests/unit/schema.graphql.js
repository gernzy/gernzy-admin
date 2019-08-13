export default `

scalar DateTime

scalar Date

type Query {

    users: [User!]!
        @paginate(type: "paginator" model: "Lab19\Cart\Models\User")
        @can(
            ability: "view",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    user(id: ID @eq): User @find(model: "Lab19\Cart\Models\User")
        @can(
            ability: "view",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    orders: [Order!]! @paginate(type: "paginator" model: "Lab19\Cart\Models\Order")

    order_items: [OrderItem!]! @paginate(type: "paginator" model: "Lab19\Cart\Models\OrderItem")
    order_item(id: ID @eq): OrderItem @find(model: "Lab19\Cart\Models\OrderItem")

}

type User {
    id: ID!
    name: String!
    email: String!
    cart: Cart,
    session: Session,
    created_at: DateTime!
    updated_at: DateTime!
}

type Session {
    id: ID!
    token: String!
    cart_id: ID
}

type Order {
    id: ID!
    email: String!
    name: String!
    currency_id: Int!
    cart_id: ID!
    is_admin_order: Boolean!
    cart: Cart @hasOne
}

type Cart {
    id: ID!
    order_id: ID
    item_count: Int!
    order: Cart @belongsTo
    items: [CartItem!]
}

type CartItem {
    product_id: ID!
    quantity: Int!
}


type OrderItem {
    id: ID!
    order_id: ID!
}

type Mutation {
    createSession : Session @field(resolver: "Lab19\Cart\GraphQL\Mutations\CreateSession@create")
    setSession(input: SetSessionInput!) : SetSessionPayload @field(resolver: "Lab19\Cart\GraphQL\Mutations\SetSession@set")
    createAccount(input: CreateAccountInput! @spread): CreateAccountPayload @field(resolver: "Lab19\Cart\GraphQL\Mutations\CreateAccount@create")
}

input CreateOrderInput {
    cart: CreateCartRelation
}

input CreateCartRelation {
    connect: ID,
    create: CreateCartInput
    update: UpdateCartInput
}

input CreateCartInput {
    item_count: Int
}

input UpdateCartInput {
    id: ID,
    item_count: Int
}

input CreateAccountInput {
    name: String!
    email: String @rules(apply: ["required", "email", "unique:cart_users,email"])
    password: String!
    token: String
}

type CreateAccountPayload {
    token: String
    user: User
}

input SetSessionInput {
    products: [ CartProductInput ! ]
}

input CartProductInput {
    id: ID!
    quantity: Int!
}

type SetSessionPayload {
    cart_uuid : String
    products: [ CartProduct ]
}

type CartProduct {
    id: ID!
    quantity: Int!
}

extend type Mutation {
    logIn(input: LoginInput! @spread): LogInPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Account@logIn")

    logOut: LogOutPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Account@logOut")

    addToCart(input: AddToCartInput!): CartPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Cart@addToCart")
        @gate(ability: "add-to-cart", sessionOnly: true )

    removeFromCart(input: RemoveFromCartInput!): CartPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Cart@removeFromCart")
        @gate(ability: "remove-from-cart", sessionOnly: true )

    updateCartQuantity(input: UpdateCartQuantityInput!): CartPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Cart@updateCartQuantity")
        @gate(ability: "add-to-cart", sessionOnly: true )

    createUser(input: CreateUserInput!): CreateUserPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\User@create")
        @can(
            ability: "create",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    updateUser(id: ID!, input: UpdateUserInput!): CreateUserPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\User@update")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    deleteUser(id:ID!): DeleteResult
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\User@delete")
        @can(
            ability: "delete",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    elevateUser(id:ID!): CreateUserPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\User@elevate")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )

    demoteUser(id:ID!): CreateUserPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\User@demote")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\User",
            policy: "Lab19\Cart\Policies\UserPolicy"
        )
}

input LoginInput {
    email: String!
    password: String!
}

type LogInPayload {
    user: User
    token: String
}

type LogOutPayload {
    success: Boolean!
}

input AddToCartInput {
    items: [ AddToCartItemInput! ]
}

input AddToCartItemInput {
    product_id: ID!
    quantity: Int!
}

type CartPayload {
    cart: Cart
}

input RemoveFromCartInput {
    product_id: ID!
    quantity: Int!
}

input UpdateCartQuantityInput {
    product_id: ID!
    quantity: Int!
}

extend type Query {
    me: User @field(resolver: "Lab19\Cart\GraphQL\Queries\Account@me")
    myOrders: [Order!] @field(resolver: "Lab19\Cart\GraphQL\Queries\Account@myOrders")
}

input CreateUserInput {
    name: String!
    email: String! @rules(apply: ["required", "email", "unique:cart_users,email"])
    password: String!
}

input UpdateUserInput {
    name: String
    email: String @rules(apply: ["email", "unique:cart_users,email"])
    password: String
}

type CreateUserPayload {
    id: ID!
    name: String!
    email: String!
    is_admin: Int
}

extend type Query {
    products(input:ProductsQueryInput): [Product!]!
        @paginate(
            type: "paginator",
            model: "Lab19\Cart\Models\Product",
            scopes: ["published", "inStock"],
            builder: "Lab19\Cart\GraphQL\Builders\ProductsBuilder@search"
        )
}

input ProductsQueryInput {
    keyword: String
}

type Product {
    id: ID!
    title: String!
    status: String!
    published: Int!
    created_at: DateTime!
    updated_at: DateTime!
}

extend type Mutation {
    createProduct(input:CreateProductInput!): Product
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\CreateProduct@create")
        @can(
            ability: "create",
            model: "Lab19\Cart\Models\Product",
            policy: "Lab19\Cart\Policies\ProductPolicy"
        )
    updateProduct(id:ID!, input:CreateProductInput): Product
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\CreateProduct@update")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\Product",
            policy: "Lab19\Cart\Policies\ProductPolicy"
        )
    deleteProduct(id:ID!, input:CreateProductInput): DeleteResult
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\CreateProduct@delete")
        @can(
            ability: "delete",
            model: "Lab19\Cart\Models\Product",
            policy: "Lab19\Cart\Policies\ProductPolicy"
        )
}

input CreateProductInput {
    title: String!
}

type DeleteResult {
    success: Boolean!
}

extend type Mutation {
    checkout(input: CheckoutInput!) : CheckoutPayload
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Checkout@checkout")
        @gate(ability: "can-checkout", sessionOnly: true)
}

extend type Query {
    order(id: ID @eq): Order @find(model: "Lab19\Cart\Models\Order")
        @can(
            ability: "view",
            model: "Lab19\Cart\Models\Order",
            policy: "Lab19\Cart\Policies\OrderPolicy"
        )
}

input CheckoutInput {
    name: String! @rules(apply: ["required"])
    email: String! @rules(apply: ["required", "email"])
    mobile: String!
    telephone: String!
    billing_address: BillingAddress! @rules(apply: ["required"])
    shipping_address: ShippingAddress! @rules(apply: ["required"])
    use_shipping_for_billing: Boolean!
    payment_method: String!
    agree_to_terms: Boolean!
    notes: String!
}

input BillingAddress {
    line_1: String! @rules(apply: ["required"])
    line_2: String
    state: String! @rules(apply: ["required"])
    postcode: String
    country: String!
}

input ShippingAddress {
    line_1: String! @rules(apply: ["required"])
    line_2: String
    state: String! @rules(apply: ["required"])
    postcode: String
    country: String! @rules(apply: ["required"])
}

type CheckoutPayload {
    success: Boolean!
    order: Order
}

extend type Mutation {
    createOrder(input: CheckoutInput!): Order
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Order@create")
        @can(
            ability: "create",
            model: "Lab19\Cart\Models\Order",
            policy: "Lab19\Cart\Policies\OrderPolicy"
        )
    updateOrder(id: ID!, input: UpdateOrderInput!): Order
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Order@update")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\Order",
            policy: "Lab19\Cart\Policies\OrderPolicy"
        )
    setOrderItems(id: ID!, input: [SetOrderItemsInput!]): Order
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Order@setItems")
        @can(
            ability: "update",
            model: "Lab19\Cart\Models\Order",
            policy: "Lab19\Cart\Policies\OrderPolicy"
        )
    deleteOrder(id: ID!): DeleteResult
        @field(resolver: "Lab19\Cart\GraphQL\Mutations\Order@delete")
        @can(
            ability: "delete",
            model: "Lab19\Cart\Models\Order",
            policy: "Lab19\Cart\Policies\OrderPolicy"
        )
}

input UpdateOrderInput {
    name: String
    email: String @rules(apply: ["email"])
    mobile: String
    telephone: String
    billing_address: BillingAddress
    shipping_address: ShippingAddress
    use_shipping_for_billing: Boolean
    payment_method: String
    notes: String
}

input SetOrderItemsInput {
    product_id: ID!
    quantity: Int!
}


`;
