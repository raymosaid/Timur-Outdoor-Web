"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: "",
        avatar_url: "",
        user_role: "pegawai",
      }
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/kasir");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const updateUserProfile = async (formData: FormData) => {
  console.log("Action Form Data", formData)

  const supabase = await createClient();

  const avatar = formData.get("avatar");
  console.log(formData.get("username"))

  if (!(avatar instanceof File) || avatar.size <= 0) {
    console.log("No Avatar Uploaded")
    const { data: dataUpdate, error: errorUpdate } = await supabase.auth.updateUser({
      data: {
        username: formData.get("username"),
        phone_number: formData.get("phone_number")
      }
    })
    
    if (errorUpdate) {
      console.error("Error update user profile", errorUpdate)
      return {status: "failed", data: errorUpdate}
    }

    return {status: "success", data: dataUpdate}

  } else {
    const { data, error } = await supabase
      .storage
      .from('timur')
      .upload(`avatar/${crypto.randomUUID()}_${avatar?.name}`, avatar, {
        cacheControl: '3600',
        upsert: false
      })
    console.log("Avatar Uploaded", data)

    if (error) {
      console.error("Upload error:", error.message);
      return {status: "failed", data: error};
    }

    const { data: dataUpdate, error: errorUpdate } = await supabase.auth.updateUser({
      data: {
        username: formData.get("username"),
        avatar_url: data.path,
        phone_number: formData.get("phone_number")
      }
    })
    
    if (errorUpdate) {
      console.error("Error update user profile", errorUpdate)
      return {status: "failed", data: errorUpdate}
    }
    
    console.log("Success updated user profile", dataUpdate)
    return {status: "success", data: dataUpdate}
  }
}


export const addProduct = async (formData: FormData) => {
  const supabase = await createClient();
  const productImage = formData.get("product_image")
  formData.delete("product_image")

  if (!(productImage instanceof File) || productImage.size <= 0) {
    const { data: dataInsert, error: errorInsert } = await supabase
      .from("products")
      .insert({
        name: formData.get("name"),
        category: formData.get("category"),
        rent_price: formData.get("rent_price") ? formData.get("rent_price") : 0,
        sell_price: formData.get("sell_price") ? formData.get("sell_price") : 0,
        jumlah_barang: formData.get("jumlah_barang") ? formData.get("jumlah_barang") : 0
      })
      .select()
    
    if (errorInsert) {
      console.error("Error insert product", errorInsert)
      return {
        status: "error",
        message: errorInsert,
      }
    }
    
    console.log("Success inserted product", dataInsert)
    return {
      status: "success",
      message: dataInsert,
      data: dataInsert[0],
    }
    
  } else {
    const { data, error } = await supabase
      .storage
      .from('timur')
      .upload(`product/${crypto.randomUUID()}_${productImage?.name}`, productImage, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error("Upload error:", error.message);
      return {
        status: "error",
        message: error
      }
    }

    formData.append("image_url", data.path)

    const { data: dataInsert, error: errorInsert } = await supabase
      .from("products")
      .insert({
        name: formData.get("name"),
        image_url: formData.get("image_url"),
        category: formData.get("category"),
        rent_price: formData.get("rent_price") ? formData.get("rent_price") : 0,
        sell_price: formData.get("sell_price") ? formData.get("sell_price") : 0,
        jumlah_barang: formData.get("jumlah_barang") ? formData.get("jumlah_barang") : 0
      })
      .select()
    
    if (errorInsert) {
      console.error("Error insert product", errorInsert)
      return {
        status: "error",
        message: errorInsert
      }
    }
    
    console.log("Success inserted product", dataInsert)
    return {
      status: "success",
      data: dataInsert[0]
    } 
  }
}


export const addTransaction = async(formData: FormData, listItemOrder: any[], payments: any[]) => {
  const data = Object.fromEntries(formData.entries())
  const supabase = await createClient();
  const { data: insertData, error } = await supabase
    .from('transactions')
    .insert([data])
    .select()

  if (error) {
    return {
      status: "error",
      message: error.message,
    }
  }

  const transactionId = insertData[0].id

  const items_order = listItemOrder.map(({ product, ...rest }) => ({
    transaction_id: transactionId,
    product_id: product.id,
    ...rest
  }))

  const paymentsData = payments.map(payment => ({
    transaction_id: transactionId,
    ...payment
  }))

  const { data: insert_transaction_items, error: error_items } = await supabase
    .from('transaction_items')
    .insert(items_order)
    .select()

  const { data: insert_payments, error: error_payments } = await supabase
    .from('transactions_payments')
    .insert(paymentsData)
    .select()

  if (error_items) {
    return {
      status: "error",
      message: error_items.message
    }
  }
  if (error_payments) {
    return {
      status: "error",
      message: error_payments.message
    }
  }

  return {
    status: "success",
    message: "success",
    transaction: insertData,
    transaction_items: insert_transaction_items,
    transactions_payments: insert_payments,
  }
}

export const akhiriTransaksi = async(transactionId: number) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update({ is_return: true, status: 'Selesai' })
    .eq('id', transactionId)

  if (error) {
    return {
      status: "error",
      error: error
    }
  }
  return {
    status: "OK",
  }
}