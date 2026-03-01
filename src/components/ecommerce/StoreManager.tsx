'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  type: 'PHYSICAL' | 'DIGITAL' | 'SUBSCRIPTION';
  inventory: number;
  image: string;
  variants: number;
}

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Premium T-Shirt', slug: 'premium-tshirt', price: 29.99, comparePrice: 39.99, status: 'ACTIVE', type: 'PHYSICAL', inventory: 150, image: '', variants: 6 },
  { id: '2', name: 'Design Templates Pack', slug: 'design-templates', price: 49.00, status: 'ACTIVE', type: 'DIGITAL', inventory: -1, image: '', variants: 0 },
  { id: '3', name: 'Monthly Pro Access', slug: 'monthly-pro', price: 19.99, status: 'ACTIVE', type: 'SUBSCRIPTION', inventory: -1, image: '', variants: 0 },
  { id: '4', name: 'Hoodie Classic', slug: 'hoodie-classic', price: 54.99, status: 'DRAFT', type: 'PHYSICAL', inventory: 45, image: '', variants: 3 },
];

const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-2026-001', email: 'customer1@example.com', total: 79.98, status: 'DELIVERED', items: 2, createdAt: '2026-02-28' },
  { id: '2', orderNumber: 'ORD-2026-002', email: 'customer2@example.com', total: 49.00, status: 'PAID', items: 1, createdAt: '2026-02-27' },
  { id: '3', orderNumber: 'ORD-2026-003', email: 'customer3@example.com', total: 124.97, status: 'SHIPPED', items: 3, createdAt: '2026-02-26' },
  { id: '4', orderNumber: 'ORD-2026-004', email: 'customer4@example.com', total: 19.99, status: 'PENDING', items: 1, createdAt: '2026-02-25' },
];

export function StoreManager() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons' | 'settings'>('products');
  const [showNewProduct, setShowNewProduct] = useState(false);

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    ACTIVE: 'success', DRAFT: 'warning', ARCHIVED: 'default',
    DELIVERED: 'success', SHIPPED: 'info', PAID: 'success', PENDING: 'warning', CANCELLED: 'danger',
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: '$12,456.78', change: '+24%' },
          { label: 'Orders', value: '156', change: '+12%' },
          { label: 'Products', value: '24', change: '+3' },
          { label: 'Conversion Rate', value: '3.2%', change: '+0.5%' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-surface-200">
            <p className="text-xs text-surface-500">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-surface-900">{stat.value}</span>
              <span className="text-xs font-medium text-green-600 mb-1">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-surface-200">
        {(['products', 'orders', 'coupons', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors',
              activeTab === tab
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search products..." className="w-64" />
            <Button onClick={() => setShowNewProduct(true)}>+ Add Product</Button>
          </div>
          <div className="bg-white rounded-xl border border-surface-200">
            <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
              <span className="col-span-4">Product</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-1">Type</span>
              <span className="col-span-2">Inventory</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-2">Actions</span>
            </div>
            {mockProducts.map(product => (
              <div key={product.id} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center text-sm">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex-shrink-0" />
                  <div>
                    <p className="font-medium text-surface-900">{product.name}</p>
                    <p className="text-xs text-surface-400">{product.variants} variants</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                  {product.comparePrice && (
                    <span className="ml-1 text-xs text-surface-400 line-through">${product.comparePrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="col-span-1">
                  <Badge>{product.type}</Badge>
                </div>
                <div className="col-span-2 text-surface-600">
                  {product.inventory === -1 ? 'Unlimited' : product.inventory}
                </div>
                <div className="col-span-1">
                  <Badge variant={statusColors[product.status]}>{product.status}</Badge>
                </div>
                <div className="col-span-2 flex gap-1">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-surface-200">
          <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
            <span className="col-span-2">Order</span>
            <span className="col-span-3">Customer</span>
            <span className="col-span-2">Total</span>
            <span className="col-span-1">Items</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2">Date</span>
          </div>
          {mockOrders.map(order => (
            <div key={order.id} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center text-sm hover:bg-surface-50 cursor-pointer">
              <span className="col-span-2 font-medium font-mono text-surface-900">{order.orderNumber}</span>
              <span className="col-span-3 text-surface-600">{order.email}</span>
              <span className="col-span-2 font-medium">${order.total.toFixed(2)}</span>
              <span className="col-span-1 text-surface-500">{order.items}</span>
              <div className="col-span-2">
                <Badge variant={statusColors[order.status]}>{order.status}</Badge>
              </div>
              <span className="col-span-2 text-surface-400">{order.createdAt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button>+ Create Coupon</Button>
          </div>
          <div className="bg-white rounded-xl border border-surface-200">
            {[
              { code: 'WELCOME20', type: 'Percentage', value: '20%', uses: '45/100', expires: '2026-06-01', active: true },
              { code: 'FREESHIP', type: 'Free Shipping', value: 'N/A', uses: '23/50', expires: '2026-04-01', active: true },
              { code: 'SUMMER10', type: 'Fixed', value: '$10', uses: '12/unlimited', expires: 'Never', active: false },
            ].map(coupon => (
              <div key={coupon.code} className="flex items-center justify-between p-4 border-b border-surface-100 last:border-0">
                <div>
                  <span className="font-mono font-semibold text-surface-900">{coupon.code}</span>
                  <p className="text-xs text-surface-400 mt-0.5">{coupon.type}: {coupon.value}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-surface-500">Used: {coupon.uses}</span>
                  <span className="text-xs text-surface-500">Expires: {coupon.expires}</span>
                  <Badge variant={coupon.active ? 'success' : 'default'}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white p-6 rounded-xl border border-surface-200">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Payment Gateways</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💳</span>
                  <div>
                    <p className="text-sm font-medium">Stripe</p>
                    <p className="text-xs text-surface-400">Credit cards, Apple Pay, Google Pay</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🅿️</span>
                  <div>
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-surface-400">PayPal payments and checkout</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-surface-200">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Store Settings</h3>
            <div className="space-y-3">
              <Select label="Currency" options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'CAD', label: 'CAD (C$)' },
              ]} />
              <Input label="Tax Rate (%)" placeholder="0" type="number" />
              <Input label="Shipping Flat Rate ($)" placeholder="0.00" type="number" />
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      <Modal isOpen={showNewProduct} onClose={() => setShowNewProduct(false)} title="Add Product" size="lg">
        <div className="space-y-4">
          <Input label="Product Name" placeholder="e.g., Premium T-Shirt" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" placeholder="0.00" type="number" />
            <Input label="Compare at Price" placeholder="0.00" type="number" />
          </div>
          <Select label="Product Type" options={[
            { value: 'PHYSICAL', label: 'Physical Product' },
            { value: 'DIGITAL', label: 'Digital Product' },
            { value: 'SUBSCRIPTION', label: 'Subscription' },
          ]} />
          <textarea className="builder-input h-24" placeholder="Product description..." />
          <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center text-sm text-surface-400">
            Drop product images here or click to upload
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowNewProduct(false)}>Cancel</Button>
            <Button>Create Product</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
