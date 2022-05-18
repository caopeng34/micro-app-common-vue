import idCardValid from "../utils/idCardValid";
import regexp from "../utils/regexp";

const rules = {
    data() {
        return {}
    },
    filters: {
        filters_null(val) {
            if (typeof val === "number" || typeof val === "boolean" || val) {
                return val
            } else {
                return '暂无'
            }
        }
    },
    methods: {
        // 判空
        rules_null(val) {
            if (typeof val !== "number" && typeof val !== "boolean" && val) {
                return true;
            } else {
                return false;
            }
        },
        // 身份证号
        rules_idcardno(val) {
            return idCardValid(val);
        },
        // 手机号
        rules_phone(val) {
            return regexp.isPhoneNumber(val);
        },
        // 密码
        rules_password(val) {
            return regexp.isPassword(val);
        },
        // 数字大于零
        rules_lgzero(val) {
            if (typeof val === "number" || typeof val === "string") {
                let regNumber = /^\+?[1-9][0-9]*$/;
                return regNumber.test(val);
            } else {
                return false;
            }
        },
        // 数字大于等于零
        rules_lgezero(val) {
            if (typeof val === "number" || (typeof val === "string" && val.length > 0)) {
                let regNumber = /^\+?[0-9]*$/;
                return regNumber.test(val);
            } else {
                return false;
            }
        },
    }
}
export default rules