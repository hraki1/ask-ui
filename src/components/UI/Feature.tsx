import { motion } from "framer-motion";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

export default function Feature({ title, description, icon }: FeatureProps) {
  return (
    <motion.div
      className="bg-zinc-800 p-6 rounded-2xl shadow-md shadow-zinc-700 text-center flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </motion.div>
  );
}
