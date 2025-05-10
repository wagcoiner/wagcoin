
import React from "react";
import { motion } from "framer-motion";

const Supporters = () => {
  const supporters = [
    {
      name: "CoinGecko",
      logo: "/supporters/coingecko.svg"
    },
    {
      name: "Dextools",
      logo: "/supporters/dextools.svg"
    },
    {
      name: "Gate.io",
      logo: "/supporters/gateio.svg"
    },
    {
      name: "DexScreener",
      logo: "/supporters/dexscreener.svg"
    },
    {
      name: "Pinksale",
      logo: "/supporters/pinksale.svg"
    }
  ];

  return (
    <motion.div 
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-emerald-400 mb-4">
          Our Supporters
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Trusted by industry leaders in the crypto space
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {supporters.map((supporter, index) => (
          <motion.div
            key={supporter.name}
            className="bg-gray-900 p-6 rounded-xl border border-neon-green/10 hover:border-neon-green/30 transition-all duration-300 shadow-lg hover:shadow-neon-green/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <img 
              src={supporter.logo} 
              alt={`${supporter.name} logo`} 
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Supporters;
