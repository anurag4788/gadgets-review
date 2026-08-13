"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import gadgetService from "@/services/gadgetService";
import brandService from "@/services/brandService";
import categoryService from "@/services/categoryService";

export default function CreateGadgetPage() {

    const router = useRouter();

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        model: "",
        description: "",
        releaseYear: "",
        brandId: "",
        categoryId: "",
    });

    const [imageFile, setImageFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [loadingOptions, setLoadingOptions] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD BRANDS & CATEGORIES
    // ==========================================

    useEffect(() => {

        async function loadOptions() {

            try {

                const [
                    brandsResponse,
                    categoriesResponse,
                ] = await Promise.all([

                    brandService.getAll(),

                    categoryService.getAll(),

                ]);


                setBrands(
                    brandsResponse.data.data.brands
                );


                setCategories(
                    categoriesResponse.data.data
                );


            } catch (error) {

                console.error(
                    "Load Options Error:",
                    error
                );

                setError(
                    "Failed to load brands and categories."
                );

            } finally {

                setLoadingOptions(false);

            }

        }

        loadOptions();

    }, []);


    // ==========================================
    // HANDLE TEXT INPUT
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
    // CREATE GADGET
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        try {

            setLoading(true);


            // ==================================
            // STEP 1: UPLOAD IMAGE
            // ==================================

            let imageUrl = null;


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
            // STEP 2: CREATE GADGET
            // ==================================

            await gadgetService.create({

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

            });


            // ==================================
            // STEP 3: REDIRECT
            // ==================================

            router.push(
                "/admin/gadgets"
            );


        } catch (error) {

            console.error(
                "Create Gadget Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create gadget."
            );


        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOADING OPTIONS
    // ==========================================

    if (loadingOptions) {

        return (

            <main>

                <h1>
                    Create Gadget
                </h1>

                <p>
                    Loading...
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
                Create Gadget
            </h1>


            {error && (

                <p>
                    {error}
                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >


                {/* ==========================
                    NAME
                ========================== */}

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
                        disabled={loading}
                    />

                </div>


                {/* ==========================
                    MODEL
                ========================== */}

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
                        disabled={loading}
                    />

                </div>


                {/* ==========================
                    DESCRIPTION
                ========================== */}

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
                        disabled={loading}
                    />

                </div>


                {/* ==========================
                    IMAGE
                ========================== */}

                <div>

                    <label>
                        Gadget Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                        disabled={loading}
                    />


                    {imageFile && (

                        <p>
                            Selected:{" "}
                            {imageFile.name}
                        </p>

                    )}

                </div>


                {/* ==========================
                    RELEASE YEAR
                ========================== */}

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
                        disabled={loading}
                    />

                </div>


                {/* ==========================
                    BRAND
                ========================== */}

                <div>

                    <label>
                        Brand
                    </label>

                    <select
                        name="brandId"
                        value={form.brandId}
                        onChange={handleChange}
                        required
                        disabled={loading}
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


                {/* ==========================
                    CATEGORY
                ========================== */}

                <div>

                    <label>
                        Category
                    </label>

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                        disabled={loading}
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


                {/* ==========================
                    BUTTONS
                ========================== */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating..."
                        : "Create Gadget"}

                </button>


                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/gadgets"
                        )
                    }
                    disabled={loading}
                >

                    Cancel

                </button>


            </form>

        </main>

    );

}