'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import type { CollectionField, FieldType } from '@/types/builder';
import { generateId, slugify } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  slug: string;
  fields: CollectionField[];
  itemCount: number;
}

const fieldTypeOptions: Array<{ value: FieldType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'richtext', label: 'Rich Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'image', label: 'Image' },
  { value: 'file', label: 'File' },
  { value: 'color', label: 'Color' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi Select' },
  { value: 'reference', label: 'Reference' },
  { value: 'json', label: 'JSON' },
  { value: 'slug', label: 'Slug' },
  { value: 'markdown', label: 'Markdown' },
];

export function CollectionEditor() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Blog Posts',
      slug: 'blog-posts',
      itemCount: 12,
      fields: [
        { id: '1', name: 'Title', slug: 'title', type: 'text', required: true },
        { id: '2', name: 'Content', slug: 'content', type: 'richtext', required: true },
        { id: '3', name: 'Featured Image', slug: 'featured-image', type: 'image', required: false },
        { id: '4', name: 'Published Date', slug: 'published-date', type: 'date', required: true },
        { id: '5', name: 'Category', slug: 'category', type: 'select', required: true, options: ['Technology', 'Design', 'Business'] },
        { id: '6', name: 'Author', slug: 'author', type: 'text', required: true },
      ],
    },
    {
      id: '2',
      name: 'Team Members',
      slug: 'team-members',
      itemCount: 5,
      fields: [
        { id: '1', name: 'Name', slug: 'name', type: 'text', required: true },
        { id: '2', name: 'Role', slug: 'role', type: 'text', required: true },
        { id: '3', name: 'Photo', slug: 'photo', type: 'image', required: false },
        { id: '4', name: 'Bio', slug: 'bio', type: 'richtext', required: false },
      ],
    },
    {
      id: '3',
      name: 'Portfolio Items',
      slug: 'portfolio-items',
      itemCount: 8,
      fields: [
        { id: '1', name: 'Title', slug: 'title', type: 'text', required: true },
        { id: '2', name: 'Description', slug: 'description', type: 'richtext', required: true },
        { id: '3', name: 'Image', slug: 'image', type: 'image', required: true },
        { id: '4', name: 'URL', slug: 'url', type: 'url', required: false },
        { id: '5', name: 'Tags', slug: 'tags', type: 'multiselect', required: false, options: ['Web', 'Mobile', 'Brand', 'UI/UX'] },
      ],
    },
  ]);

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [showNewField, setShowNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newCollectionName, setNewCollectionName] = useState('');

  const activeCollection = collections.find(c => c.id === selectedCollection);

  const handleCreateCollection = () => {
    if (!newCollectionName) return;
    const collection: Collection = {
      id: generateId(),
      name: newCollectionName,
      slug: slugify(newCollectionName),
      fields: [
        { id: generateId(), name: 'Title', slug: 'title', type: 'text', required: true },
      ],
      itemCount: 0,
    };
    setCollections([...collections, collection]);
    setSelectedCollection(collection.id);
    setNewCollectionName('');
    setShowNewCollection(false);
  };

  const handleAddField = () => {
    if (!newFieldName || !activeCollection) return;
    const field: CollectionField = {
      id: generateId(),
      name: newFieldName,
      slug: slugify(newFieldName),
      type: newFieldType,
      required: false,
    };
    setCollections(collections.map(c =>
      c.id === activeCollection.id
        ? { ...c, fields: [...c.fields, field] }
        : c
    ));
    setNewFieldName('');
    setShowNewField(false);
  };

  return (
    <div className="flex h-full">
      {/* Collections List */}
      <div className="w-64 border-r border-surface-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">Collections</h3>
          <Button size="sm" variant="ghost" onClick={() => setShowNewCollection(true)}>+</Button>
        </div>
        <div className="space-y-1">
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCollection === col.id
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-surface-600 hover:bg-surface-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{col.name}</span>
                <Badge>{col.itemCount}</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Collection Detail */}
      <div className="flex-1 p-6">
        {activeCollection ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-surface-900">{activeCollection.name}</h2>
                <p className="text-sm text-surface-500">/{activeCollection.slug} - {activeCollection.itemCount} items</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Items</Button>
                <Button size="sm" onClick={() => setShowNewField(true)}>+ Add Field</Button>
              </div>
            </div>

            {/* Fields */}
            <div className="bg-white rounded-xl border border-surface-200">
              <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
                <span className="col-span-4">Field Name</span>
                <span className="col-span-2">Slug</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2">Required</span>
                <span className="col-span-2">Actions</span>
              </div>
              {activeCollection.fields.map(field => (
                <div key={field.id} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center text-sm">
                  <span className="col-span-4 font-medium text-surface-900">{field.name}</span>
                  <span className="col-span-2 text-surface-500 font-mono text-xs">{field.slug}</span>
                  <span className="col-span-2">
                    <Badge variant="info">{field.type}</Badge>
                  </span>
                  <span className="col-span-2">
                    {field.required && <Badge variant="warning">Required</Badge>}
                  </span>
                  <div className="col-span-2 flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Items Preview */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Items</h3>
              <div className="bg-white rounded-xl border border-surface-200 p-4 text-center text-sm text-surface-400">
                <p>Content items are managed through the CMS editor.</p>
                <Button variant="primary" size="sm" className="mt-3">Open CMS Editor</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-surface-400 mb-4">Select a collection to manage its fields and content</p>
            <Button onClick={() => setShowNewCollection(true)}>Create Collection</Button>
          </div>
        )}
      </div>

      {/* New Collection Modal */}
      <Modal isOpen={showNewCollection} onClose={() => setShowNewCollection(false)} title="New Collection" size="sm">
        <Input
          label="Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="e.g., Blog Posts, Products, Team"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setShowNewCollection(false)}>Cancel</Button>
          <Button onClick={handleCreateCollection}>Create</Button>
        </div>
      </Modal>

      {/* New Field Modal */}
      <Modal isOpen={showNewField} onClose={() => setShowNewField(false)} title="Add Field" size="sm">
        <Input
          label="Field Name"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          placeholder="e.g., Title, Description"
        />
        <Select
          label="Field Type"
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value as FieldType)}
          options={fieldTypeOptions}
          className="mt-3"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setShowNewField(false)}>Cancel</Button>
          <Button onClick={handleAddField}>Add Field</Button>
        </div>
      </Modal>
    </div>
  );
}
