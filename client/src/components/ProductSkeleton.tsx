const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
