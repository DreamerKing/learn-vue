Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{todo.text}}</li>'
});

const app = new Vue({
    el: "#root",
    data: {
        message: "Hello Vue!",
        seen: false,
        seenMessage: '',
        firstName: '',
        lastName: '',
        question: '',
        isActive: true,
        hasError: false,
        answer: 'I cannot give you an answer until you ask a question!',
        todos: [
            { text: "学习MDN"},
            { text: "学习JS忍者秘笈"},
            { text: "学习JavaScript高级程序设计"}
        ]
    },
    methods: {
        reverseWord(){
            this.message = this.message.split('').reverse().join('');
        },
        showList(){
            this.seen = !this.seen;
        },
        getAnswer(){
            console.log(this.question, "q");
            if(this.question.indexOf('?') == -1){
                this.answer = 'Questions usually contain a question mark. ;-)';
                return;
            }
            console.log(window.axios, "axios");
            
            this.answer = "Thinking ...";
            window.axios.get("https://yesno.wtf/api")
                .then((res) => {
                    this.answer = _.capitalize(res.data.answer);
                })
                .catch((err)=> {
                    this.answer = 'Error! Could not reach the API. ' + err
                })
        }
    },
    created(){
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
    },
    computed: {
        reverseWord2() {
            return this.message.split('').reverse().join('');
        },
        seenMessage2(){
            return `${this.message}:${this.seen}`;
        },
        fullName: {
            get: function(){
                return `${this.firstName} ${this.lastName}` 
            },
            set: function(full){
                let fl = full && full.trim().split(/\s+/);
                this.firstName = (fl && fl[0])||'';
                this.lastName = (fl && fl[1]) || '';
            }
        }
    },
    watch: {
        message(val){
            this.seenMessage = `${val}: ${this.seen}`
        },
        seen(val) {
            this.seenMessage = `${this.message}: ${val}`
        },
        question(nq, oq){
            this.answer = 'Waiting for you to stop typing...',
            this.debouncedGetAnswer();
        }
    }
});

console.log(app);

