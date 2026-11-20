import { z } from "zod";

export const reviewSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(60),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().min(3, "Reflection is too short").max(1000),
  topics: z.array(z.string().max(30)).max(5).optional().default([]),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Full name is required").max(80),
  customerEmail: z.string().trim().email("Valid email is required").toLowerCase(),
  deliveryMethod: z.enum(["delivery", "pickup"]).default("delivery"),
  shippingAddress: z
    .object({
      street: z.string().trim().max(150).optional().default(""),
      city: z.string().trim().max(80).optional().default(""),
      country: z.string().trim().max(80).optional().default(""),
      postalCode: z.string().trim().max(20).optional().default(""),
    })
    .optional()
    .default({}),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        selectedVariant: z.string().max(80).optional().default(""),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
  samples: z.array(z.string().max(80)).max(3).optional().default([]),
  giftOptions: z
    .object({
      bagSelected: z.boolean().default(false),
      addMessage: z.boolean().default(false),
      message: z.string().max(200).optional().default(""),
    })
    .optional()
    .default({ bagSelected: false, addMessage: false, message: "" }),
  promoCode: z.string().trim().max(30).nullable().optional(),
  paymentMethod: z.enum(["cod", "card-sandbox"]).default("cod"),
});

export const subscriberSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").toLowerCase(),
  phone: z.string().trim().max(30).optional().default(""),
});