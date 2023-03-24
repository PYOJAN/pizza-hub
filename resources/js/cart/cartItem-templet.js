export const cartItemTempleteHtml = (item) => {
  return `
  <tr class="bg-white border-b hover:bg-gray-100 cart-ordered-items" data-item_id="${item._id}">
  <td class="w-1/3 p-4">
    <div class="flex flex-row items-center">
      <div class="w-20 min-w-[50px]">
        <img src="/img/olive-mixed-pizza.png" alt="img" />
      </div>
      <div class="ml-5 text-slate-600">
        <h1 class="font-bold text-lg capitalize mb-2">${item.name}</h1>
        <span class="text-xs uppercase font-light text-rose-400 tracking-wider bg-rose-100 px-2 py-1 rounded-full">
          ${item.size}
        </span>
      </div>
    </div>
  </td>
  <td class="px-6 py-4 w-52">
    <div class="flex items-center space-x-3">
      <button
        class="qyt-decrement-btn inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-rose-100 "
        type="button"
        >
        <span class="sr-only pointer-events-none">Quantity button</span>
        <svg class="w-4 h-4 pointer-events-none" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd">
          </path>
        </svg>
      </button>
      <div>
        <input value="${item.qty}" type="text" id=""
          class="bg-gray-50 w-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1 text-center "
          placeholder="1" required>
      </div>
      <button
        class="qyt-increment-btn inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-rose-100 "
        type="button">
        <span class="sr-only">Quantity button</span>
        <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  </td>
  <td class="px-6 py-4 font-semibold text-gray-900">
    <span>₹</span>
    <span id="singlePrice">${item.price}</span>
    <span>/-</span>
  </td>
  <td class="px-6 py-4 font-semibold text-gray-900 relative ">
    <span>
      <span>₹</span>
      <span id="totalPrice">
        ${(item.price * item.qty)}
      </span>
      <span>/-</span>
    </span>
    <div role="button" class="remove-cart-item absolute top-1/2 -translate-y-1/2 right-10 w-6 h-6 cursor-pointer hover:scale-105">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class='pointer-events-none'>
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier" class="pointer-events-none">
          <path class="stroke-rose-500"
            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
            stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path class="stroke-rose-500"
            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="none"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path class="stroke-rose-500"
            d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
            stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path class="stroke-rose-500" d="M10.33 16.5H13.66" stroke="" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></path>
          <path class="stroke-rose-500" d="M9.5 12.5H14.5" stroke="none" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></path>
        </g>
      </svg>
    </div>
  </td>
</tr>
  `;
}