export class MarketListModel {
    public products: Product[] = [];
    public name: string = '';
    public house: string = '';
}

export class Product {
    public name: string = '';
    public quantity: number = 0;
    public unit: string = '';
    public brand: string = '';
    public purchased: boolean = false
}
