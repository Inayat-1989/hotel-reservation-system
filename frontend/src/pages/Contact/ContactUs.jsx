const ContactUs = ({ account, url }) => {
  return (
    <a
      href={url}
      className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c93400] text-white transition-all duration-300 shadow-sm"
    >
      {account}
    </a>
  );
};

export default ContactUs;
