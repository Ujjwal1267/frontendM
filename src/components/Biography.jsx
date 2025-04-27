import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
          Welcome to our clinic Medicare, where compassionate care and medical excellence come together. We understand that healthcare is deeply personal, and we are here to provide support and expertise tailored to each patient’s unique needs. Our team of skilled doctors, nurses, and support staff is dedicated to ensuring a comfortable and reassuring experience, whether you’re visiting for a routine check-up, specialized treatment, or preventive care. We use the latest diagnostic tools and treatments to deliver high-quality, effective healthcare in a warm and welcoming environment. At our clinic, we believe that healthcare is not just about treating illnesses—it’s about building lasting relationships with our patients to help them achieve and maintain optimal health. Your well-being is our priority, and we are here to guide you at every step of your health journey with empathy, professionalism, and respect.
          </p>
         
        </div>
      </div>
    </>
  );
};

export default Biography;
