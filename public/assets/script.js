const form = document.getElementById('req-res-form');

form.elements['req_method'].forEach(el => {
    el.addEventListener('change', (e) => {
        form.setAttribute('method', e.target.value)
    })
})

form.elements['res_type'].forEach(el => {
    el.addEventListener('change', (e) => {
        if (e.target.value == 'json') {
            form.setAttribute('target', '_blank')
        } else {
            form.removeAttribute('target') 
        }
    })
})

form.querySelectorAll('.js-error').forEach((el) => {
    el.addEventListener('change', () => {
        el.parentNode.querySelectorAll('.js-method input').forEach((cEl) => {
            cEl.checked = false
        })
    })
})

form.querySelectorAll('.js-method').forEach((el, index) => {
    el.addEventListener('change', () => {
        el.parentNode.querySelectorAll('.js-error input').forEach((cEl) => {
            cEl.checked = false
        })
    })
})
