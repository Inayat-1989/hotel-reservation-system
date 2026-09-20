const ContactUsMainContentCard = ({ symbol, heading, listOfItems }) => {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-[#c93400]/50 transition-colors">
      <h2 className="text-xl font-semibold text-[#c93400] mb-3 flex items-center gap-2">
        {symbol} {heading}
      </h2>
      <ul className="space-y-2 text-sm text-gray-200">
        {Object.entries(listOfItems || {}).map(([key, value]) => (
          <li key={key}>
            <strong className="text-white">{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContactUsMainContentCard