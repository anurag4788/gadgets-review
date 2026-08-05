import { registerSchema } from "@/validations/authValidations";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(request) {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
        return errorResponse(
            result.error.issues[0].message,
            400
        );
    }
    const { name, email, password } = result.data;
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        return errorResponse("Email already Exists,", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
  },
});
    return successResponse(
        "User Registered Sucessfuly ,",
        user,
        201
    );
}