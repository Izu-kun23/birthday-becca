import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Banner from "../components/Banner";
import Polaroid from "../components/Polaroid";

import becca1 from "../assets/images/becca1.jpg";
import becca from "../assets/images/becca.jpg";
import becca4 from "../assets/images/becca4.jpeg";
import { uploadFile } from "../../api/formController";

import {
  saveBirthdayWish,
  fetchBirthdayWishes,
  editBirthdayWish,
  deleteBirthdayWish,
} from "../../api/formController";

const polaroidData = [
  { src: becca, caption: "Rebecca" },
  { src: becca4, caption: "Birthday" },
  { src: becca1, caption: "Happy" },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.8,
      delayChildren: 0.8,
    },
  },
};
const basePolaroidVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
  slideOut: {
    x: 70,
    opacity: 1,
    scale: 1.05,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};
const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

const HomePage: React.FC = () => {
  const whoIsRebeccaRef = useRef<HTMLElement>(null);
  const wishesSectionRef = useRef<HTMLElement>(null);

  const textAnimationControls = useAnimation();
  const polaroidsAnimationControls = useAnimation();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [animateSection, setAnimateSection] = useState(false);

  const [showBirthdayButton, setShowBirthdayButton] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWishesSection, setShowWishesSection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);

  // State to store fetched birthday wishes
  const [wishes, setWishes] = useState<
    Array<{ id: string; name: string; message: string; createdAt: Date | null }>
  >([]);

  // Track which wish is currently being edited, if any
  const [editingWishId, setEditingWishId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [, setIsEditing] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  useEffect(() => {
    if (animateSection) {
      const sequence = async () => {
        await textAnimationControls.start("visible");
        await polaroidsAnimationControls.start("visible");
        setTimeout(() => {
          setShowBirthdayButton(true);
        }, 2000);
      };
      sequence();
    }
  }, [animateSection, textAnimationControls, polaroidsAnimationControls]);

  // Fetch wishes from Firestore when wishes section is shown
  useEffect(() => {
    if (showWishesSection) {
      loadWishes();
    }
  }, [showWishesSection]);

  const loadWishes = async () => {
    try {
      const fetchedWishes = await fetchBirthdayWishes();
      setWishes(fetchedWishes);
    } catch (error) {
      console.error("Error fetching wishes:", error);
    }
  };

  const scrollToRebeccaSection = () => {
    if (whoIsRebeccaRef.current) {
      whoIsRebeccaRef.current.scrollIntoView({ behavior: "smooth" });
      setAnimateSection(true);
    }
  };

  const handlePolaroidClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedFileUrl: string | undefined = undefined;

      if (selectedFile) {
        setFileUploading(true);
        uploadedFileUrl = await uploadFile(selectedFile);
        setFileUploading(false);
      }

      await saveBirthdayWish(name, message, uploadedFileUrl);

      alert("Thank you for your wish!");
      setName("");
      setMessage("");
      setSelectedFile(null);
      setIsModalOpen(false);
      if (showWishesSection) {
        await loadWishes();
      }
    } catch (error) {
      alert("Failed to save your wish. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setFileUploading(false);
    }
  };

  const handleBirthdayButtonClick = () => {
    setShowWishesSection(true);
    setTimeout(() => {
      if (wishesSectionRef.current) {
        wishesSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setIsModalOpen(true);
    }, 300);
  };

  // === EDIT handlers ===
  const startEditing = (wish: {
    id: string;
    name: string;
    message: string;
  }) => {
    setEditingWishId(wish.id);
    setEditName(wish.name);
    setEditMessage(wish.message);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingWishId(null);
    setEditName("");
    setEditMessage("");
    setIsEditing(false);
  };

  const submitEdit = async (id: string) => {
    setIsEditSubmitting(true);
    try {
      await editBirthdayWish(id, { name: editName, message: editMessage });
      await loadWishes();
      cancelEditing();
    } catch (error) {
      alert("Failed to update wish. Please try again.");
      console.error(error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // === DELETE handler ===
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this wish?")) return;
    try {
      await deleteBirthdayWish(id);
      await loadWishes();
    } catch (error) {
      alert("Failed to delete wish. Please try again.");
      console.error(error);
    }
  };

  const rotations = ["-10deg", "8deg", "-5deg"];
  const positions = [
    { top: 0, left: 0 },
    { top: 80, left: 120 },
    { top: 160, left: 60 },
  ];

  return (
    <div className="bg-pink-100 min-h-screen overflow-x-hidden">
      <Banner onLearnMoreClick={scrollToRebeccaSection} />

      {/* Who is Rebecca Section */}
      <motion.section
        ref={whoIsRebeccaRef}
        className="relative z-10 mt-20 mx-auto flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 max-w-full md:max-w-6xl gap-8 md:gap-12"
        initial="hidden"
        animate={animateSection ? "visible" : "hidden"}
      >
        {/* Text */}
        <motion.div
          className="flex-1 text-left text-pink-700 max-w-full md:max-w-lg"
          variants={textVariants}
          initial="hidden"
          animate={textAnimationControls}
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-6 font-uber-move">
            What today is
          </h3>
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {`Today is a very special day for Rebecca Cuffy-Oliver, as it marks her 22nd birthday! 🎉

Rebecca is a vibrant and caring individual who brings joy to everyone around her. She has a passion for God and a heart full of love, making her birthday a perfect occasion to celebrate all that she is.

On this day, we want to remind Rebecca of how much she means to us and how grateful we are for her presence in our lives. Let’s make this birthday unforgettable!

So it is only right that we wish her happy birthday and make her feel extra special. ❤️
`}
          </p>
        </motion.div>

        {/* Polaroids */}
        {animateSection && (
          <motion.div
            className="flex-1 relative w-full max-w-full sm:max-w-lg min-h-[460px] sm:h-[400px]"
            variants={containerVariants}
            initial="hidden"
            animate={polaroidsAnimationControls}
          >
            {polaroidData.map(({ src, caption }, index) => {
              const isSelected = clickedIndex === index;

              return (
                <motion.div
                  key={index}
                  style={{
                    position: "absolute",
                    top: positions[index].top,
                    left: positions[index].left,
                    width: isSelected ? "240px" : "180px",
                    maxWidth: "90vw",
                    cursor: "pointer",
                    userSelect: "none",
                    zIndex: isSelected ? 99 : 10 + index,
                    transform: `rotate(${rotations[index]})`,
                    boxShadow: isSelected
                      ? "0 15px 25px rgba(0,0,0,0.3)"
                      : "0 8px 15px rgba(0,0,0,0.1)",
                  }}
                  variants={basePolaroidVariants}
                  initial="hidden"
                  animate={isSelected ? "slideOut" : "visible"}
                  onClick={() => handlePolaroidClick(index)}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <Polaroid imageSrc={src} caption={caption} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

      {/* Birthday Wishes Section */}
      {showWishesSection && (
        <motion.section
          ref={wishesSectionRef}
          className="bg-white py-8 sm:py-12 mt-16 sm:mt-20 px-4 sm:px-8 max-w-full overflow-x-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          <motion.div className="mx-auto max-w-full sm:max-w-5xl rounded-2xl shadow-md border border-pink-300 p-4 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-pink-800 font-uber-move">
              Birthday Wishes for Rebecca 🎈
            </h3>

            <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
              {wishes.length === 0 ? (
                <p className="text-pink-600 min-w-full text-center">
                  No wishes yet. Be the first to wish Rebecca!
                </p>
              ) : (
                wishes.map((wish) => {
                  const isEditing = editingWishId === wish.id;

                  return (
                    <div
                      key={wish.id}
                      className="min-w-[250px] max-w-xs flex-shrink-0 border border-pink-300 p-4 rounded shadow-sm bg-pink-50 relative"
                    >
                      {isEditing ? (
                        <>
                          <input
                            className="w-full border border-pink-400 rounded px-2 py-1 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isEditSubmitting}
                          />
                          <textarea
                            className="w-full border border-pink-400 rounded px-2 py-1 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            rows={4}
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            disabled={isEditSubmitting}
                          />
                          <div className="flex justify-between">
                            <button
                              onClick={() => submitEdit(wish.id)}
                              disabled={isEditSubmitting}
                              className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition disabled:opacity-50"
                            >
                              {isEditSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isEditSubmitting}
                              className="text-pink-600 hover:text-pink-800 underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-pink-700">
                            {wish.name}
                          </p>
                          <p className="whitespace-pre-wrap text-pink-800">
                            {wish.message}
                          </p>
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => startEditing(wish)}
                              className="text-pink-600 hover:text-pink-800 underline text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(wish.id)}
                              className="text-red-600 hover:text-red-800 underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full max-w-xs bg-pink-600 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 transition sm:w-auto"
              >
                Wish Rebecca Happy Birthday
              </button>
            </div>
          </motion.div>
        </motion.section>
      )}

      

      {/* Birthday Wish Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm  bg-opacity-60 z-50 px-4"
          onClick={() => {
            setIsModalOpen(false);
            setName("");
            setMessage("");
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-pink-700">
              Send Birthday Wish
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="border border-pink-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
              />
              <textarea
                placeholder="Your Birthday Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                disabled={isSubmitting}
                className="border border-pink-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
              />
              
              <button
                type="submit"
                disabled={isSubmitting || fileUploading}
                className="bg-pink-600 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 transition w-full"
              >
                {isSubmitting
                  ? "Sending..."
                  : fileUploading
                  ? "Uploading file..."
                  : "Send"}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-pink-600 hover:text-pink-800 font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Birthday Button */}
      {showBirthdayButton && !showWishesSection && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleBirthdayButtonClick}
            className="bg-pink-600 text-white py-3 px-5 rounded-full shadow-lg hover:bg-pink-700 transition font-bold"
          >
            Wish Becca Happy Birthday🎉
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
