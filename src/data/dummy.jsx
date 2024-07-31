export default{
    firstName:'James',
    lastName:'Carter',
    address:'Pheonix, AZ',
    phone:'(123)-456-7890',
    email:'exmaple@gmail.com',
    portfolio:'portfolio-example.com',
    themeColor:"#38761d",

    education:[
        {
            id:1,
            universityName:'Western Illinois University',
            startDate1:'Aug 2018',
            endDate1:'Dec 2019',
            degree:'Bachelor',
            major:'Computer Science',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        },
        {
            id:2,
            universityName:'Western Illinois University',
            startDate1:'Aug 2020',
            endDate1:'Dec 2021',
            degree:'Master',
            major:'Computer Science',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        }
    ],

    experience:[
        {
            id:1,
            title1:'Full Stack Developer',
            companyName:'Amazon',
            city:'New York',
            state:'NY',
            startDate:'Jan 2021',
            endDate:'',
            currentlyWorking:true,
            workSummary:' Designed, developed, and maintained full-stack applications using React and Node.js.\n'+
            '• Implemented responsive user interfaces with React, ensuring seamless user experiences across\n'+
            'various devices and browsers.\n'
        },
        {
            id:2,
            title1:'Frontend Developer',
            companyName:'Google',
            city:'Charlotte',
            state:'NC',
            startDate:'May 2019',
            endDate:'Jan 2021',
            currentlyWorking:false,
            workSummary:'Maintaining the React Native in-house organization application.'+
            '• CreatedRESTfulAPIs withNode.js and Express,facilitating data communicationbetween the front-end'+
            'and back-end systems.'
        }
    ],
    
    projects:[
        {
            id:1,
            projectName:'Face Recognition',
            technologies: 'Python, Javascript, HTML, CSS',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        },
        {
            id:2,
            projectName:'AI Resume Builder',
            technologies: 'ReactJS, Tailwind CSS, RESTful API',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        }
    ],

    skills:[
        {
            id:1,
            name:'Angular',
        },
        {
            id:2,
            name:'React',
        },
        {
            id:3,
            name:'MySql',
        },
        {
            id:4,
            name:'React Native',
        },
        {
            id:5,
            name:'Python',
        }
    ]
}