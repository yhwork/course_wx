
		
const clocks=(timestamp)=>{
  let self = this
          let format=null;
					let timer = setInterval(()=>{
							let nowTime = new Date()
							let endTime = new Date(timestamp)
							let t = endTime.getTime() - nowTime.getTime()
							if(t > 0) {
								let day = Math.floor(t / 86400000)
								let hour = Math.floor((t / 3600000) % 24)
								let min = Math.floor((t / 60000) % 60)
								let sec = Math.floor((t / 1000) % 60)
								let msec= Math.floor((t % 1000)/100) //换成毫秒
								hour = hour < 10 ? '0' + hour : hour
								min = min < 10 ? '0' + min : min
								sec = sec < 10 ? '0' + sec : sec
								msec = msec < 0 ? '0'+ msec: msec
								if(day > 0) {
									format = `${day}.${hour}.${min}.${sec}.${msec}`
                  console.log("我是谁")
                  console.log(this)
                  self.setData({
                    time: format
                  })
                  
								}
								if(day <= 0 && hour > 0) {
                  console.log("我是谁")
									format = `${hour}.${min}.${sec}.${msec}`
                  self.setData({
                    time: format
                  })
								}
								if(day <= 0 && hour <= 0) {
                  console.log("我是谁")
									format = `${min}.${sec}.${msec}`
                  self.setData({
                    time: format
                  })
								}
								
							} else {
								clearInterval(timer)
							}
						}, 15)
}
		
// module.exports= {
//    clocks:clocks
//   }
           
           export {clocks}
      