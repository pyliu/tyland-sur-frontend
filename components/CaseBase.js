export default {
    name: 'CaseBase',
    props: {
        raw: { type: Object, require: true }
    },
    computed: {
        _id() {
            return this.raw?._id;
        },
        formatedYear() {
            return ("000" + this.raw?.year).slice(-3);
        },
        formatedCode() {
            return ("XXXX" + this.raw?.code).slice(-4);
        },
        formatedNum() {
            return ("000000" + this.raw?.num).slice(-6);
        },
        caseId() {
            return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`;
        },
        formatedCaseId() {
            return `${this.formatedYear} 年 ${this.code}(${this.formatedCode}) 字 ${this.formatedNum} 號`;
        },
        rawCaseId() {
            return this.caseId.replaceAll("-", "");
        },
        opdate() {
            return this.raw?.opdate;
        },
        sectionCode() {
            return this.raw?.section;
        },
        section() {
            return this.sections.get(this.raw?.section);
        },
        code() {
            return this.codes.get(this.raw?.code);
        },
        creator() {
            return this.raw?.creator;
        }
    }
}
