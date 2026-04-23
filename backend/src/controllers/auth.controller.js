import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken } = await generateAccessTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true, // Always true for cross-origin deployments (Vercel -> Render)
        sameSite: "none" // Required for cross-origin cookies
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
