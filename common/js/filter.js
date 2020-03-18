export default {
    /**
     * 数字表示
     * @param {*} num 
     */
    thousandBitSeparator(num) {
        if (!isNaN(num)) num = Number(num);
        return num && (
            num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
                return $1 + ",";
            }) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($0, $1) {
                return $1 + ",";
            }));
    },
    /**
     * 浮点数转化
     * @param {*} Dight 
     * @param {*} How 
     */
    forDight(Dight, How = 2){  
        Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);  
        return Dight;  
    },
    /**
     * 格式化时间
     * @param {*} date 
     * @param {*} fmt 
     */
    formatDate(date, fmt) {
        date = new Date(date * 1000);
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt;
    },
    /**
     * 秒转时间
     * @param {*} value 
     */
    formatSeconds(value, fmt) {
        let theTime = parseInt(value);// 秒
        let m = 0;// 分
        let h = 0;// 小时
        const formatInt = (val) => {
           if (parseFloat(val) < 10) return `0${val}`;
           return val; 
        };
        if (theTime > 60) {
            m = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
                if (m >= 60) {
                    h = parseInt(m / 60);
                    m = parseInt(m % 60);
                }
        }
        let s = formatInt(parseInt(theTime));
        if (m > 0) {
            m =  parseInt(m);
        }
        m =  formatInt(m);
        if (h > 0) {
            h = parseInt(h);
        }
        h = formatInt(h);
        return fmt.replace(/(h+)/, h).replace(/(m+)/, m).replace(/(s+)/, s);
    },
    /**
     * 获取参数
     * @param {*} _search 
     */
    getQuery(_search) {
        let temp = {};

        if (_search) {
            let searchArry = _search.split('&'),
                searchIndex = 0,
                searchArryLen = searchArry.length,
                tempSearch = [];
            for (searchIndex; searchIndex < searchArryLen; searchIndex++) {
                tempSearch = searchArry[searchIndex].split("=");
                temp[tempSearch[0]] = tempSearch[1];
            }
        }
        return temp;
    }
};