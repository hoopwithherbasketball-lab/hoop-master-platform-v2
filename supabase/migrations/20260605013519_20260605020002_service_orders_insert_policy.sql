-- Allow anyone (including guests) to place an order
CREATE POLICY "Anyone can create orders" ON service_orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert own orders" ON service_orders
  FOR INSERT TO authenticated
  WITH CHECK (customer_user_id = auth.uid() OR customer_user_id IS NULL);
