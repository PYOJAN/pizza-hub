
import "./cart";
import './userRegiastration/userRegistration';
import './userLogin';

const userAvatar = document.querySelector('.user-avatar');
userAvatar && userAvatar.addEventListener("click", e => {
  document.getElementById('userDropdown').classList.toggle('hidden');
});

