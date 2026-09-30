import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Video, Search, ExternalLink } from "lucide-react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import {
  ProductionModeBadge,
  ProductionStatusBadge,
  CloudinaryStatusBadge,
  QC1Badge,
} from "../components/StatusBadges";
import { fetchAssetsByType, fetchProducts, createAsset } from "../lib/api";
import type { Asset, Product, ProductionMode } from "../types";
import { PRODUCTION_MODES, CONTENT_TYPES_B } from "../types";

type AssetWithProduct = Asset & { products: Product };

export default function Console1Content() {
  const [assets, setAssets] = useState<AssetWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, prods] = await Promise.all([
        fetchAssetsByType("B"),
        fetchProducts(),
      ]);
      setAssets(data);
      setProducts(prods);
    } catch (err) {
      showToast("error", "Failed to load content assets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = assets.filter(
    (a) =>
      a.asset_code.toLowerCase().includes(search.toLowerCase()) ||
      a.products?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.products?.product_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Console 1 — Digital Content Master (B)"
        subtitle="B: Short-form marketing video — register, QC-1, and make available to Console 2"
        actions={
          <button
            className="btn-primary"
            onClick={() => setShowCreate(true)}
            disabled={products.length === 0}
          >
            <Plus size={16} /> Create B Content
          </button>
        }
      />

      <div className="p-6">
        {products.length === 0 && (
          <div className="mb-4 rounded-lg bg-warning-50 border border-warning-200 p-3 text-sm text-warning-800">
            You need to create a product first before adding B content.{" "}
            <Link to="/console1/products" className="font-medium underline">
              Go to Products →
            </Link>
          </div>
        )}

        <div className="mb-4 relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="input pl-9"
            placeholder="Search by Asset ID or Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="card">
            <div className="p-8 text-center text-gray-400 text-sm">
              Loading content assets...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Video size={24} />}
              title="No B content yet"
              description="Register marketing video masters (B) and pair them with products (A)."
              action={
                products.length > 0 ? (
                  <button
                    className="btn-primary"
                    onClick={() => setShowCreate(true)}
                  >
                    <Plus size={16} /> Create B Content
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Asset ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Linked Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Mode
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Production
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    QC-1
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Cloudinary
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Console 2
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs font-medium text-gray-900">
                      {asset.asset_code}
                      <span className="text-gray-400 ml-1">
                        v{asset.version}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/product/${asset.product_id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {asset.products?.product_code}
                      </Link>
                      <span className="text-gray-400 ml-1.5 text-xs">
                        {asset.products?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 uppercase text-xs">
                      {asset.content_type}
                    </td>
                    <td className="py-3 px-4">
                      <ProductionModeBadge mode={asset.production_mode} />
                    </td>
                    <td className="py-3 px-4">
                      <ProductionStatusBadge
                        status={asset.production_status}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <QC1Badge status={asset.qc1_status} />
                    </td>
                    <td className="py-3 px-4">
                      <CloudinaryStatusBadge
                        status={asset.cloudinary_status}
                      />
                    </td>
                    <td className="py-3 px-4">
                      {asset.console2_available ? (
                        <span className="badge-success">Available</span>
                      ) : (
                        <span className="badge-neutral">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateBContentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        products={products}
        onCreated={() => {
          setShowCreate(false);
          load();
        }}
      />
    </div>
  );
}

function CreateBContentModal({
  open,
  onClose,
  products,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onCreated: () => void;
}) {
  const [productId, setProductId] = useState("");
  const [contentType, setContentType] = useState("video/mp4");
  const [productionMode, setProductionMode] = useState<ProductionMode>("MANUAL");
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const reset = () => {
    setProductId("");
    setContentType("video/mp4");
    setProductionMode("MANUAL");
    setFileName("");
    setNotes("");
  };

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      showToast("warning", "Select a product to link this B content to");
      return;
    }
    setCreating(true);
    try {
      const product = selectedProduct!;
      const existingB = await fetchAssetsByType("B");
      const count = existingB.filter(
        (a) => a.product_id === productId
      ).length;

      const assetCode =
        count === 0
          ? `${product.product_code}-B`
          : `${product.product_code}-B-VID-${String(count + 1).padStart(2, "0")}`;

      await createAsset({
        product_id: productId,
        asset_type: "B",
        asset_code: assetCode,
        content_type: contentType,
        production_mode: productionMode,
        file_name: fileName.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      showToast("success", `B content ${assetCode} created and paired`);
      reset();
      onCreated();
    } catch (err) {
      showToast("error", "Failed to create B content");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create B Content" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Linked Product *</label>
          <select
            className="input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.product_code} — {p.name}
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className="text-xs text-primary-600 mt-1.5">
              Asset will be paired to {selectedProduct.product_code}-A
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Content Type</label>
            <select
              className="input"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              {CONTENT_TYPES_B.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              Default: short-form video (15–25s MP4)
            </p>
          </div>
          <div>
            <label className="label">Production Mode</label>
            <select
              className="input"
              value={productionMode}
              onChange={(e) =>
                setProductionMode(e.target.value as ProductionMode)
              }
            >
              {PRODUCTION_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">File Name</label>
          <input
            className="input font-mono text-xs"
            placeholder="e.g. MRONE-001-B-CONTENT-V1.mp4"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[60px]"
            placeholder="Optional notes about this content..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create B Content"}
          </button>
        </div>

        <div className="rounded-lg bg-accent-50 p-3 text-xs text-accent-700">
          B content is paired to the selected product by Product ID. The
          recommended naming follows: MRONE-001-B-CONTENT-V1.mp4
        </div>
      </form>
    </Modal>
  );
}
