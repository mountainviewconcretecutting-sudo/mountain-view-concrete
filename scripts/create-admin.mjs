import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const [email, password, fullName] = process.argv.slice(2);

if (!email || !password) {
  console.log("Usage: npm run create-admin <email> <password> [fullName]");
  process.exit(1);
}

async function createAdmin() {
  console.log(`Creating or updating admin for: ${email}...`);

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  let user = usersData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error("Failed to create auth user:", createError.message);
      process.exit(1);
    }
    user = createData.user;
    console.log(`Created new auth user: ${user.id}`);
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      console.error("Failed to update password:", updateError.message);
      process.exit(1);
    }
    console.log(`Updated password for existing user: ${user.id}`);
  }

  const name = fullName || email.split("@")[0];
  const { error: profileError } = await supabase
    .from("admin_profiles")
    .upsert({ id: user.id, full_name: name });

  if (profileError) {
    console.error("Failed to insert admin_profile:", profileError.message);
    process.exit(1);
  }

  console.log(`✅ Success! Admin account ready.`);
  console.log(`Email: ${email}`);
  console.log(`Name: ${name}`);
}

createAdmin().catch(console.error);
