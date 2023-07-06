export class ProductsDTO{
    constructor(newItem){
        this.title = newItem.title,
        this.description = newItem.description,
        this.price = newItem.price,
        this.thumbnail = newItem.thumbnail,
        this.code = newItem.code,
        this.stock = newItem.stock,
        this.status = true,
        this.category = newItem.category
        this.owner = newItem.owner
    }
}