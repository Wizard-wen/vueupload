function syncForEach (list, fn){
    if(!list.length){
        return Promise.resolve()
    }

    return new Promise((resolve, reject)=>{
        var gen = step(list, async function (item, index) {
            try {
                await fn(item, index);
                var result = gen.next()
                if(result.done){
                    resolve()
                }
            } catch (e){
                reject(e);
            }
        });

        gen.next()
    })

}

function *step(list, fn) {
    for(let i = 0; i < list.length; i++){
        fn(list[i], i);
        yield;
    }
}

syncForEach([1,2,3,4], (i)=>{
    return new Promise((resolve, reject)=>{
        console.log(i, '开始')
        setTimeout(()=>{
            console.log(i, '结束');
            resolve(i)}
            ,1000)
    });
})

export default syncForEach;
