'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    product: '',
    quantity: 1,
    priority: 'NORMAL',
    address: '',
    latitude: '',
    longitude: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    router.push('/orders');
  };

  return (
    <div id="new-order-page" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Order</h1>
          <p className="page-subtitle">Enter delivery details below</p>
        </div>
        <button className="btn btn-ghost" onClick={() => router.push('/orders')}>← Back to Orders</button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input className="form-input" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="e.g. Lerato Mokoena" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input className="form-input" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required placeholder="+27 83 123 4567" />
          </div>
          <div className="form-group">
            <label className="form-label">Product *</label>
            <input className="form-input" name="product" value={formData.product} onChange={handleChange} required placeholder="e.g. Laptop Docking Station" />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Delivery Address *</label>
            <input className="form-input" name="address" value={formData.address} onChange={handleChange} required placeholder="e.g. 55 Paul Kruger St, Pretoria CBD" />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input className="form-input" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="-25.7479" />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input className="form-input" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="28.2293" />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <div style={{ padding: '10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              💡 Tip: Click on the map to auto-fill coordinates
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" name="notes" value={formData.notes} onChange={handleChange} placeholder="Special instructions (e.g. ring bell twice)" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => router.push('/orders')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} id="submit-order-btn">
            {isSubmitting ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : '⚡ Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
