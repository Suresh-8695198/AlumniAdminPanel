import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, Image, X } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Sortable, MultiDrag } from 'sortablejs';
import { useSortable } from 'react-sortablejs';

const ToolbarPlugin = ({ editor, onImageInsert }) => {
  return (
    <div className="flex gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-t-xl shadow-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-all duration-200 ${
          editor.isActive('bold')
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Bold size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-all duration-200 ${
          editor.isActive('italic')
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Italic size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition-all duration-200 ${
          editor.isActive('underline')
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Underline size={20} />
      </button>
      <label className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg cursor-pointer transition-all duration-200">
        <Image size={20} />
        <input type="file" accept="image/*" multiple onChange={onImageInsert} hidden />
      </label>
    </div>
  );
};

const NewsletterEditor = ({ initialData = {}, isEditing = false, onSave }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    subtitle: initialData.subtitle || '',
    description: initialData.description || '',
    url: initialData.url || '',
    uploaded_images: [],
  });
  const [imagePreviews, setImagePreviews] = useState(
    initialData.images?.map((img) => ({ url: img.image, id: img.id })) || []
  );
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const sortableRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      ImageExtension.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder: 'Enter your content here...', emptyEditorClass: 'text-gray-400' }),
    ],
    content: initialData.description || '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
    editorProps: { attributes: { class: 'prose max-w-none focus:outline-none text-gray-800' } },
  });

  useEffect(() => {
    if (editor && initialData.description) {
      editor.commands.setContent(initialData.description);
    }
  }, [editor, initialData.description]);

  useEffect(() => {
    setFormData({
      title: initialData.title || '',
      subtitle: initialData.subtitle || '',
      description: initialData.description || '',
      url: initialData.url || '',
      uploaded_images: [],
    });
    setImagePreviews(initialData.images?.map((img) => ({ url: img.image, id: img.id })) || []);
  }, [initialData]);

  useEffect(() => {
    if (sortableRef.current) {
      Sortable.create(sortableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: (evt) => {
          const newPreviews = [...imagePreviews];
          const [movedItem] = newPreviews.splice(evt.oldIndex, 1);
          newPreviews.splice(evt.newIndex, 0, movedItem);
          setImagePreviews(newPreviews);
          setFormData((prev) => ({
            ...prev,
            uploaded_images: newPreviews
              .filter((preview) => !preview.id)
              .map((preview) => preview.file),
          }));
        },
      });
    }
  }, [imagePreviews]);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      url: '',
      uploaded_images: [],
    });
    setImagePreviews([]);
    if (editor) {
      editor.commands.setContent('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });
    setFormData((prev) => ({
      ...prev,
      uploaded_images: [...prev.uploaded_images, ...validFiles],
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => ({ url: URL.createObjectURL(file), file })),
    ]);
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...imagePreviews];
    const removed = newPreviews.splice(index, 1)[0];
    setImagePreviews(newPreviews);
    setFormData((prev) => ({
      ...prev,
      uploaded_images: prev.uploaded_images.filter(
        (img) => img !== removed.file
      ),
    }));
    if (removed.id && isEditing) {
      // Optionally send API request to delete image
      api.delete(`newsletters/${initialData.id}/images/${removed.id}/`).catch((error) => {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      });
    }
  };

  const handleImageInsert = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (status) => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description) {
      toast.error('Description is required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle || '');
    data.append('description', formData.description);
    data.append('url', formData.url || '');
    data.append('status', status);
    formData.uploaded_images.forEach((image) => {
      data.append('uploaded_images', image);
    });

    try {
      let response;
      if (isEditing) {
        response = await api.put(`newsletters/${initialData.id}/`, data);
      } else {
        response = await api.post('newsletters/', data);
      }
      toast.success(status === 'draft' ? 'Draft saved!' : 'Newsletter published!');
      onSave();
      resetForm();
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save newsletter');
      console.error('Save error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-poppins bg-gradient-to-b from-white to-gray-50">
      <Toaster position="top-right" toastOptions={{ className: 'bg-white/90 text-gray-800 backdrop-blur-md shadow-lg' }} />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
        {isEditing ? 'Edit Newsletter' : 'Create Newsletter'}
      </h1>
      <form
        className="space-y-6 bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter subtitle"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          {editor && <ToolbarPlugin editor={editor} onImageInsert={handleImageInsert} />}
          <EditorContent
            editor={editor}
            className="w-full mt-2 p-6 bg-gray-50 border border-gray-200 rounded-b-xl min-h-[250px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 prose prose-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Images (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            multiple
            onChange={handleImageChange}
            className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700 transition-all duration-200"
          />
          {imagePreviews.length > 0 && (
            <div
              ref={sortableRef}
              className="mt-4 grid grid-cols-2 gap-4"
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200"
                      title="Remove Image"
                    >
                      <X size={16} />
                    </button>
                    <div
                      className="drag-handle bg-blue-600 text-white p-2 rounded-full cursor-move hover:bg-blue-700 transition-all duration-200"
                      title="Drag to Reorder"
                    >
                      <Image size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter URL"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterEditor;