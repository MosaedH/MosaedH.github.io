const about = document.querySelector('#about')
const aboutContent = document.querySelector('#about-content')
const contact = document.querySelector('#contact')
const contactContent = document.querySelector('#contact-content')
const skills = document.querySelector('#skills')
const skillsContent = document.querySelector('#content-skills')

about.addEventListener('click', () => {
    const aboutBox = new WinBox({
        title: 'About Me',
        background: '#FF013C',
        width: '400px',
        height: '400px',
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
        mount: aboutContent,
    })
    
})



contact.addEventListener('click', () => {
    const contactBox = new WinBox({
        title: 'contact',
        background: '#FF013C',
        width: '400px',
        height: '400px',
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
        mount: contactContent,
    })
    
})


skills.addEventListener('click', () => {
    const skillsBox = new WinBox({
        title: 'skills',
        background: '#FF013C',
        width: '400px',
        height: '400px',
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
        mount: skillsContent,
    })
    
})