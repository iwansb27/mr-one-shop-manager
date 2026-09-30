import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Package, Search, ChevronRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import {
  ProductionModeBadge,
  OverallStatusBadge,
  CloudinaryStatusBadge,
} from "../components/StatusBadges";
import {
  fetchProducts,
  fetchAssetsByProduct,
  createProduct,
  createAsset,
} from "../lib/api";
import type { Product, Asset, ProductionMode } from "../types";
import { CATEGORIES, PRODUCTION_MODES, CONTENT_TYPES_A } from "../types";

export default function Console1Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [assetCounts, setAssetCounts] = useState<
    Record<string, { a: number; b: number; stored: number }>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      const counts: Record<string, { a: number; b: number; stored: number }> =
        {};
      for (const p of data) {
        const assets = await fetchAssetsByProduct(p.id);
        counts[p.id] = {
          a: assets.filter((a) => a.asset_type === "A").length,
          b: assets.filter((a) => a.asset_type === "B").length,
          stored: assets.filter((a) => a.cloudinary_status === "stored")
            .length,
        };
      }
      setAssetCounts(counts);
    } catch (err) {
      showToast("error", "Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Console 1 — Master Asset Storage"
        subtitle="A: Digital Product Master — register, QC-1, and pair with B content"
        actions={
          <button
            className="btn-primary"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={16} /> Create Product
          </button>
        }
      />

      <div className="p-6">
        <div className="mb-4 relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="input pl-9"
            placeholder="Search by name or Product ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="card">
            <div className="p-8 text-center text-gray-400 text-sm">
              Loading products...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Package size={24} />}
              title="No products yet"
              description="Create your first product to start registering A/B master assets."
              action={
                <button
                  className="btn-primary"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus size={16} /> Create Product
                </button>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Product ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Mode
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    A/B
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Masters
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => {
                  const counts = assetCounts[product.id] || {
                    a: 0,
                    b: 0,
                    stored: 0,
                  };
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-medium text-gray-900">
                        {product.product_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {product.category || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 uppercase">
                        {product.product_type}
                      </td>
                      <td className="py-3 px-4">
                        <ProductionModeBadge mode={product.production_mode} />
                      </td>
                      <td className="py-3 px-4">
                        <OverallStatusBadge status={product.overall_status} />
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600">
                          <span className="font-medium text-gray-900">
                            {counts.a}
                          </span>
                          A /{" "}
                          <span className="font-medium text-gray-900">
                            {counts.b}
                          </span>{" "}
                          B
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600">
                          {counts.stored} stored
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/product/${product.id}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateProductModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          load();
        }}
      />
    </div>
  );
}

function CreateProductModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("pdf");
  const [productionMode, setProductionMode] = useState<ProductionMode>("MANUAL");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const reset = () => {
    setName("");
    setCategory("");
    setProductType("pdf");
    setProductionMode("MANUAL");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("warning", "Product name is required");
      return;
    }
    setCreating(true);
    try {
      const product = await createProduct({
        name: name.trim(),
        category: category || undefined,
        product_type: productType,
        production_mode: productionMode,
        description: description.trim() || undefined,
      });

      // Auto-create the A asset for this product
      await createAsset({
        product_id: product.id,
        asset_type: "A",
        asset_code: `${product.product_code}-A`,
        content_type: productType,
        production_mode: productionMode,
      });

      showToast("success", `Product ${product.product_code} created with A asset`);
      reset();
      onCreated();
    } catch (err) {
      showToast("error", "Failed to create product");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Product Name *</label>
          <input
            className="input"
            placeholder="e.g. Budget Planner 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Product Type</label>
            <select
              className="input"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              {CONTENT_TYPES_A.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Production Mode</label>
          <select
            className="input"
            value={productionMode}
            onChange={(e) => setProductionMode(e.target.value as ProductionMode)}
          >
            {PRODUCTION_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1.5">
            MANUAL = production happens outside the app. Result is registered
            and stored here.
          </p>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[80px]"
            placeholder="Optional description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create Product + A Asset"}
          </button>
        </div>

        <div className="rounded-lg bg-primary-50 p-3 text-xs text-primary-700">
          A new Product ID will be auto-generated (e.g. MRONE-001). An A asset
          (Digital Product Master) will be automatically created and paired.
        </div>
      </form>
    </Modal>
  );
}
