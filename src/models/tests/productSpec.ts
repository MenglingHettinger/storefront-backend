import { Product, ProductStore } from '../../models/product';

const store = new ProductStore()

describe("Product Model", () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.index).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
        id: "1",
        name: 'iPhone 12',
        price: 900,
        category: 'cell phone'
      });
    expect(result).toEqual({
        id: "1",
        name: 'iPhone 12',
        price: 900,
        category: 'cell phone'
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([{
        id: "1",
        name: 'iPhone 12',
        price: 900,
        category: 'cell phone'
    }]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show("1");
    expect(result).toEqual({
        id: "1",
        name: 'iPhone 12',
        price: 900,
        category: 'cell phone'
    });
  });

  it('delete method should remove the product', async () => {
    store.delete("1");
    const result = await store.index()

    expect(result).toEqual([]);
  });
});