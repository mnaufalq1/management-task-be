import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: { name: string; description: string; category: string }) => void;
  initialData?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product Design');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCategory(initialData.category || 'Product Design');
    } else {
      setName('');
      setDescription('');
      setCategory('Product Design');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#DFD3C3] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A1C28]/10 border border-[#7A1C28]/20 flex items-center justify-center text-[#7A1C28]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2A1B17]">
                {initialData ? 'Edit Project' : 'Tambah Project Baru'}
              </h3>
              <p className="text-xs text-[#8C7769]">
                Isi detail proyek untuk mulai membuat dan mengelola task
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE8DC] text-[#7A1C28] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Project */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">
              Nama Project <span className="text-[#7A1C28]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Redesign Mobile UI MataApp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
            />
          </div>

          {/* Kategori Project */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
            >
              <option value="Product Design">Product Design</option>
              <option value="Engineering">Engineering & Development</option>
              <option value="Marketing">Marketing & Launch</option>
              <option value="Operations">Operations & Business</option>
              <option value="Research">Research & Analytics</option>
            </select>
          </div>

          {/* Deskripsi Project */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">
              Deskripsi Project <span className="text-[#7A1C28]">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan tujuan, ruang lingkup, dan hasil yang diharapkan dari project ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EFE8DC]">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-full bg-[#FAF6F0] hover:bg-[#F3EBE0] border border-[#E6DCCF] text-[#4A0E17] text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold shadow-md shadow-[#4A0E17]/20 cursor-pointer"
            >
              {initialData ? 'Simpan Perubahan' : 'Buat Project'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
