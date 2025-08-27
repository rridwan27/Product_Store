// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Swal from "sweetalert2";

// // mirror your API schema (rating optional)
// const productSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   price: z.coerce.number().positive("Price must be positive"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   category: z.string().min(1, "Category is required"),
//   image: z.string().url("Image must be a valid URL"),
//   rate: z.coerce.number().min(0).max(5).optional(),
//   count: z.coerce.number().min(0).optional(),
// });

// type ProductForm = z.infer<typeof productSchema>;

// export default function AddProduct() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ProductForm>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: "",
//       price: 0,
//       description: "",
//       category: "",
//       image: "",
//       rate: undefined,
//       count: undefined,
//     },
//   });

//   const onSubmit = async (values: ProductForm) => {
//     setLoading(true);
//     try {
//       // shape body to match API schema (rating nested)
//       const body = {
//         title: values.title,
//         price: values.price,
//         description: values.description,
//         category: values.category,
//         image: values.image,
//         rating:
//           (values.rate ?? values.count) !== undefined
//             ? { rate: values.rate, count: values.count }
//             : undefined,
//       };

//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         const j = await res.json().catch(() => ({}));
//         throw new Error(j.error || "Failed to create product");
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Success...",
//         text: "Product created!",
//       });
//       reset();
//       router.push("/products");
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Something went wrong";
//       Swal.fire({
//         icon: "error",
//         title: "Error...",
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-lg space-y-6 rounded-xl border bg-background p-6">
//       <h1 className="text-2xl font-bold">Add Product</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input
//             className="mt-1 w-full rounded-md border p-2"
//             {...register("title")}
//             placeholder="Backpack"
//           />
//           {errors.title && (
//             <p className="text-sm text-red-500">{errors.title.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Price</label>
//           <input
//             type="number"
//             step="0.01"
//             className="mt-1 w-full rounded-md border p-2"
//             {...register("price")}
//             placeholder="109.95"
//           />
//           {errors.price && (
//             <p className="text-sm text-red-500">{errors.price.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Category</label>
//           <input
//             className="mt-1 w-full rounded-md border p-2"
//             {...register("category")}
//             placeholder="men's clothing"
//           />
//           {errors.category && (
//             <p className="text-sm text-red-500">{errors.category.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Image URL</label>
//           <input
//             className="mt-1 w-full rounded-md border p-2"
//             {...register("image")}
//             placeholder="https://..."
//           />
//           {errors.image && (
//             <p className="text-sm text-red-500">{errors.image.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea
//             className="mt-1 w-full rounded-md border p-2"
//             rows={4}
//             {...register("description")}
//             placeholder="Your perfect pack for everyday use..."
//           />
//           {errors.description && (
//             <p className="text-sm text-red-500">{errors.description.message}</p>
//           )}
//         </div>

//         {/* Optional rating */}
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-sm font-medium">Rating (0-5)</label>
//             <input
//               type="number"
//               step="0.1"
//               min={0}
//               max={5}
//               className="mt-1 w-full rounded-md border p-2"
//               {...register("rate")}
//               placeholder="3.9"
//             />
//             {errors.rate && (
//               <p className="text-sm text-red-500">{errors.rate.message}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Count</label>
//             <input
//               type="number"
//               min={0}
//               className="mt-1 w-full rounded-md border p-2"
//               {...register("count")}
//               placeholder="120"
//             />
//             {errors.count && (
//               <p className="text-sm text-red-500">{errors.count.message}</p>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
//         >
//           {loading ? "Saving..." : "Create"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

// Zod schema: accepts strings, coerces to numbers
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL"),
  rate: z.coerce.number().min(0, "Min 0").max(5, "Max 5").optional(),
  count: z.coerce.number().min(0, "Cannot be negative").optional(),
});

// RHF generics:
// 1) Input values BEFORE resolver (can be unknown/string for number fields)
// 2) Context (unused -> `any`)
// 3) Transformed values AFTER resolver (numbers are numbers)
type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProductFormInput, any, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0, // ok as input
      description: "",
      category: "",
      image: "",
      rate: undefined,
      count: undefined,
    },
  });

  const onSubmit: SubmitHandler<ProductFormOutput> = async (values) => {
    setLoading(true);
    try {
      const body = {
        title: values.title,
        price: values.price,
        description: values.description,
        category: values.category,
        image: values.image,
        ...(values.rate !== undefined || values.count !== undefined
          ? { rating: { rate: values.rate, count: values.count } }
          : {}),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create product");
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product created!",
      });

      reset();
      router.push("/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-xl border bg-background p-6">
      <h1 className="text-2xl font-bold">Add Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            placeholder="Backpack"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-md border p-2"
            placeholder="109.95"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            placeholder="men's clothing"
            {...register("category")}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            placeholder="https://..."
            {...register("image")}
          />
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-md border p-2"
            placeholder="Your perfect pack for everyday use..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Optional rating */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              className="mt-1 w-full rounded-md border p-2"
              placeholder="3.9"
              {...register("rate")}
            />
            {errors.rate && (
              <p className="text-sm text-red-500">{errors.rate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Count</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border p-2"
              placeholder="120"
              {...register("count")}
            />
            {errors.count && (
              <p className="text-sm text-red-500">{errors.count.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
