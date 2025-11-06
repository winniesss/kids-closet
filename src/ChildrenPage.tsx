import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { db, type Child } from './db';
import { Plus, X } from 'lucide-react';

const childSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  age: z.number().min(0).max(18, '年龄必须在 0-18 之间'),
});

type ChildFormData = z.infer<typeof childSchema>;

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
  });

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const allChildren = await db.children.orderBy('createdAt').reverse().toArray();
      setChildren(allChildren);
    } catch (error) {
      console.error('加载孩子列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ChildFormData) => {
    try {
      await db.children.add({
        name: data.name,
        age: data.age,
        createdAt: new Date(),
      });
      reset();
      setIsAdding(false);
      await loadChildren();
    } catch (error) {
      console.error('添加孩子失败:', error);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('确定要删除这个孩子吗？')) {
      try {
        await db.children.delete(id);
        await loadChildren();
      } catch (error) {
        console.error('删除孩子失败:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">孩子们</h1>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                添加新孩子
              </button>
            )}
          </div>

          {isAdding && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">添加新孩子</h2>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    reset();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入孩子姓名"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年龄
                  </label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入年龄"
                    min="0"
                    max="18"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      reset();
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          )}

          {children.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">还没有添加任何孩子</p>
              <p className="text-sm mt-2">点击"添加新孩子"按钮开始添加</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="删除"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600">年龄: {child.age} 岁</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {child.createdAt instanceof Date
                      ? child.createdAt.toLocaleDateString('zh-CN')
                      : new Date(child.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
