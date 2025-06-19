export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">About Us</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Welcome to Sushman Gift Gallery, your premier destination for unique and thoughtful gifts.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded with a passion for bringing joy through carefully curated gifts, Sushman Gift Gallery has been serving customers with exceptional products and services. We believe that every gift tells a story and creates lasting memories.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To provide high-quality, unique gifts that help our customers express their feelings and create memorable moments for their loved ones. We strive to offer exceptional customer service and ensure every purchase is a delightful experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">What We Offer</h2>
            <ul className="text-gray-600 mb-6">
              <li className="mb-2">• Return Gifts for all occasions</li>
              <li className="mb-2">• Diwali and Festival Special Items</li>
              <li className="mb-2">• Picture Frames and Wall Decor</li>
              <li className="mb-2">• Combo Gifts and Packages</li>
              <li className="mb-2">• Cushions and Home Accessories</li>
              <li className="mb-2">• Cutout Standees and Custom Items</li>
              <li className="mb-2">• Digital Wallets and Gift Cards</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Secure Payments</h3>
                <p className="text-gray-600 text-sm">Safe and secure payment options for your peace of mind</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Shipping in India</h3>
                <p className="text-gray-600 text-sm">Reliable delivery across India with tracking</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Great Value & Quality</h3>
                <p className="text-gray-600 text-sm">Premium quality products at competitive prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}