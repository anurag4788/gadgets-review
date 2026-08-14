"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/lib/api";
import gadgetService from "@/services/gadgetService";
import brandService from "@/services/brandService";
import categoryService from "@/services/categoryService";

export default function EditGadgetPage() {

    const router = useRouter();
    const params = useParams();

    const slug = params.slug;


    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({
        name: "",
        model: "",
        description: "",
        releaseYear: "",
        brandId: "",
        categoryId: "",
    });


    // ==========================================
    // IMAGE
    // ==========================================

    const [existingImage, setExistingImage] =
        useState("");

    const [imageFile, setImageFile] =
        useState(null);


    // ==========================================
    // OPTIONS
    // ==========================================

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);


    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD GADGET + OPTIONS
    // ==========================================

    useEffect(() => {

        async function loadData() {

            try {

                setLoading(true);
                setError("");


                const [
                    gadgetResponse,
                    brandsResponse,
                    categoriesResponse,
                ] = await Promise.all([

                    gadgetService.getBySlug(slug),

                    brandService.getAll(),

                    categoryService.getAll(),

                ]);


                // ==================================
                // GADGET
                // ==================================

                const gadget =
                    gadgetResponse.data.data;


                setForm({

                    name:
                        gadget.name || "",

                    model:
                        gadget.model || "",

                    description:
                        gadget.description || "",

                    releaseYear:
                        gadget.releaseYear || "",

                    brandId:
                        gadget.brand?.id || "",

                    categoryId:
                        gadget.category?.id || "",

                });


                // Existing Cloudinary URL

                setExistingImage(
                    gadget.image || ""
                );


                // ==================================
                // BRANDS
                // ==================================

                setBrands(
                    brandsResponse.data.data.brands
                );


                // ==================================
                // CATEGORIES
                // ==================================

                setCategories(
                    categoriesResponse.data.data
                );


            } catch (error) {

                console.error(
                    "Load Edit Gadget Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load gadget."
                );

            } finally {

                setLoading(false);

            }

        }


        if (slug) {

            loadData();

        }

    }, [slug]);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));

    }


    // ==========================================
    // HANDLE IMAGE
    // ==========================================

    function handleImageChange(event) {

        const file =
            event.target.files[0];


        setImageFile(
            file || null
        );

    }


    // ==========================================
    // UPDATE GADGET
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");


            // ==================================
            // IMAGE URL
            // ==================================

            // Keep existing image by default

            let imageUrl =
                existingImage || null;


            // ==================================
            // STEP 1: UPLOAD NEW IMAGE
            // ==================================

            if (imageFile) {

                const formData =
                    new FormData();


                formData.append(
                    "image",
                    imageFile
                );


                const uploadResponse =
                    await api.post(
                        "/upload",
                        formData
                    );


                imageUrl =
                    uploadResponse.data.data.url;

            }


            // ==================================
            // STEP 2: UPDATE GADGET
            // ==================================

            await gadgetService.update(

                slug,

                {

                    name:
                        form.name.trim(),

                    model:
                        form.model.trim(),

                    description:
                        form.description.trim(),

                    image:
                        imageUrl,

                    releaseYear:
                        form.releaseYear
                            ? Number(
                                form.releaseYear
                            )
                            : undefined,

                    brandId:
                        form.brandId,

                    categoryId:
                        form.categoryId,

                }

            );


            // ==================================
            // STEP 3: REDIRECT
            // ==================================

            router.push(
                "/admin/gadgets"
            );


        } catch (error) {

            console.error(
                "Update Gadget Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to update gadget."
            );


        } finally {

            setSaving(false);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    Edit Gadget
                </h1>

                <p>
                    Loading gadget...
                </p>

            </main>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            <h1>
                Edit Gadget
            </h1>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >


                {/* ==================================
                    NAME
                ================================== */}

                <div>

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="iPhone 17 Pro"
                        required
                        disabled={saving}
                    />

                </div>


                {/* ==================================
                    MODEL
                ================================== */}

                <div>

                    <label>
                        Model
                    </label>

                    <input
                        type="text"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="A3295"
                        required
                        disabled={saving}
                    />

                </div>


                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <div>

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the gadget..."
                        rows={6}
                        required
                        disabled={saving}
                    />

                </div>


                {/* ==================================
                    CURRENT IMAGE
                ================================== */}

                <div>

                    <label>
                        Current Image
                    </label>


                    {existingImage ? (

                        <div>

                            <img
                                src={existingImage}
                                alt={`${form.name} image`}
                                width="200"
                            />

                        </div>

                    ) : (

                        <p>
                            No image available
                        </p>

                    )}

                </div>


                {/* ==================================
                    REPLACE IMAGE
                ================================== */}

                <div>

                    <label>
                        Replace Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                        disabled={saving}
                    />


                    {imageFile && (

                        <p>
                            Selected:{" "}
                            {imageFile.name}
                        </p>

                    )}

                </div>


                {/* ==================================
                    RELEASE YEAR
                ================================== */}

                <div>

                    <label>
                        Release Year
                    </label>

                    <input
                        type="number"
                        name="releaseYear"
                        value={form.releaseYear}
                        onChange={handleChange}
                        placeholder="2026"
                        min="1900"
                        max="2100"
                        disabled={saving}
                    />

                </div>


                {/* ==================================
                    BRAND
                ================================== */}

                <div>

                    <label>
                        Brand
                    </label>

                    <select
                        name="brandId"
                        value={form.brandId}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    >

                        <option value="">
                            Select Brand
                        </option>


                        {brands.map(
                            (brand) => (

                                <option
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ==================================
                    CATEGORY
                ================================== */}

                <div>

                    <label>
                        Category
                    </label>

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    >

                        <option value="">
                            Select Category
                        </option>


                        {categories.map(
                            (category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ==================================
                    BUTTONS
                ================================== */}

                <button
                    type="submit"
                    disabled={saving}
                >

                    {saving
                        ? "Updating..."
                        : "Update Gadget"}

                </button>


                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/gadgets"
                        )
                    }
                    disabled={saving}
                >

                    Cancel

                </button>


            </form>

        </main>

    );

}