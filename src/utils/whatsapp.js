export const WHATSAPP_PHONE = '919544236858';
export const WHATSAPP_PHONE_DISPLAY = '+91 95442 36858';

/**
 * Generate a luxury-formatted WhatsApp prefilled message for cart items
 */
export function formatCartWhatsAppMessage({
  cart,
  rawCartSubtotal,
  cartSubtotal,
  shippingFee = 0,
  formatPrice,
  userLocation = null
}) {
  const shippingCostText = shippingFee === 0 ? 'Free' : formatPrice(shippingFee);
  const totalPayable = formatPrice(cartSubtotal + shippingFee);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const lines = [
    '✨ *NOOR AL DHUHA ATELIER — BESPOKE ABAYA ORDER* ✨\n',
    `Salam / Hello! I would like to place an order for the following ${totalItemCount} item${totalItemCount > 1 ? 's' : ''}:\n`,
    '━━━━━━━━━━━━━━━━━━━━',
    '🛍️ *ORDERED ITEMS & SPECIFICATIONS:*',
    '━━━━━━━━━━━━━━━━━━━━'
  ];

  cart.forEach((item, index) => {
    const itemTotal = formatPrice(item.price * item.quantity);
    let itemSpecLines = [
      `\n*${index + 1}. ${item.name}*`,
      `   • Style / Cut: ${item.style || 'Open abaya'}`,
      `   • Work / Craft: ${item.work || 'plain'}`,
      `   • Color: ${item.color || 'Standard'}`,
      `   • Abaya Size: ${item.size || 'Standard'}`
    ];
    if (item.image) {
      itemSpecLines.push(`   • Photo: ${item.image}`);
    }
    if (item.customMeasurements) {
      if (item.customMeasurements.customDetails) {
        itemSpecLines.push(`     - Custom Notes: ${item.customMeasurements.customDetails}`);
      }
      if (item.customMeasurements.height) itemSpecLines.push(`     - Height: ${item.customMeasurements.height}`);
      if (item.customMeasurements.bust) itemSpecLines.push(`     - Bust: ${item.customMeasurements.bust}`);
      if (item.customMeasurements.length) itemSpecLines.push(`     - Custom Length: ${item.customMeasurements.length}`);
    }
    itemSpecLines.push(
      `   • Quantity: ${item.quantity}`,
      `   • Price: ${itemTotal} (${formatPrice(item.price)} each)`
    );
    lines.push(...itemSpecLines);
  });

  lines.push(
    '\n━━━━━━━━━━━━━━━━━━━━',
    '💰 *PAYMENT & ORDER SUMMARY:*',
    '━━━━━━━━━━━━━━━━━━━━',
    `• Subtotal: ${formatPrice(rawCartSubtotal)}`
  );

  lines.push(`• Shipping: ${shippingCostText}`);
  if (userLocation?.country) {
    const locText = [userLocation.city, userLocation.country].filter(Boolean).join(', ');
    lines.push(`• Destination Country: ${userLocation.flag || '📍'} ${locText}`);
  }
  lines.push(
    `• *Estimated Total: ${totalPayable}*`,
    '\n━━━━━━━━━━━━━━━━━━━━',
    '📦 *NEXT STEPS:*',
    'Please confirm piece availability, dispatch timeframe, and share payment details.',
    '\nThank you! 🌿'
  );

  return lines.join('\n');
}

/**
 * Generate a luxury-formatted WhatsApp prefilled message for a single product
 */
export function formatSingleProductWhatsAppMessage({
  product,
  colorName,
  size,
  style,
  work,
  quantity = 1,
  customMeasurements = null,
  formatPrice,
  unitPrice,
  imageUrl,
  productUrl
}) {
  const priceEach = unitPrice ?? product.price;
  const totalPrice = formatPrice(priceEach * quantity);
  const selectedStyle = style || product.defaultStyle || (product.styles && product.styles[0]) || 'Open abaya';
  const selectedWork = work || product.defaultWork || (product.works && product.works[0]) || 'plain';

  const lines = [
    '✨ *NOOR AL DHUHA ATELIER — BESPOKE ABAYA ORDER* ✨\n',
    'Salam / Hello! I would like to order this custom piece from NOOR AL DHUHA Atelier:\n',
    '━━━━━━━━━━━━━━━━━━━━',
    `*Piece:* ${product.name || 'Bespoke Abaya'}`,
    `*Style / Silhouette:* ${selectedStyle}`,
    `*Work / Craftsmanship:* ${selectedWork}`,
    `*Color:* ${colorName || product.color || product.colors?.[0]?.name || 'Standard'}`,
    `*Abaya Size:* ${size || (product.sizes && product.sizes[0]) || 'Standard'}`
  ];

  if (customMeasurements) {
    if (customMeasurements.customDetails) lines.push(`*Custom Measurements:* ${customMeasurements.customDetails}`);
    if (customMeasurements.height) lines.push(`*Height / Stature:* ${customMeasurements.height}`);
    if (customMeasurements.bust) lines.push(`*Bust Measurement:* ${customMeasurements.bust}`);
    if (customMeasurements.length) lines.push(`*Desired Garment Length:* ${customMeasurements.length}`);
  }

  const activePhoto = imageUrl || product.image || (product.gallery && product.gallery[0]);
  if (activePhoto) {
    lines.push(`*Piece Photo:* ${activePhoto}`);
  }

  if (productUrl) {
    lines.push(`*Product Page:* ${productUrl}`);
  }

  lines.push(
    `*Quantity:* ${quantity}`,
    `*Total:* ${totalPrice} (${formatPrice(priceEach)} each)`,
    '━━━━━━━━━━━━━━━━━━━━',
    '\nPlease confirm piece availability, dispatch timeline, and share payment details. Thank you! 🌿'
  );

  return lines.join('\n');
}

/**
 * Open WhatsApp with prefilled message
 */
export function openWhatsApp(message, phoneNumber = WHATSAPP_PHONE) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
