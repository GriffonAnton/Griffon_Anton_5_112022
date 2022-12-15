document.getElementById('orderId').textContent = new URL(window.location.href).searchParams.get('orderId');
localStorage.removeItem('cart');