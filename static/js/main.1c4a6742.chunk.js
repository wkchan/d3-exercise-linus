(this["webpackJsonpmetservice-exercise-linus"]=this["webpackJsonpmetservice-exercise-linus"]||[]).push([[0],{157:function(e,t,a){},158:function(e,t,a){},160:function(e,t,a){},162:function(e,t,a){},181:function(e,t,a){"use strict";a.r(t);var n=a(4),r=a.n(n),i=a(46),c=a.n(i),o=(a(157),a(158),a(0)),s=(a(160),a(2)),u=function(e){Object(n.useEffect)((function(){return r(),function(){a()}}));var t=function(e){return null!=e&&""!==e&&!isNaN(Number(e.toString()))},a=function(){o.k(".seaSurfaceWave").selectChild("svg").remove()},r=function(){var a=e.width-e.left-e.right,n=e.height-e.top-e.bottom,r=o.k(".seaSurfaceWave").append("svg").attr("width",a+e.left+e.right).attr("height",n+e.top+e.bottom).append("g").attr("transform","translate(".concat(e.left,",").concat(e.top,")"));o.d("/data.csv",(function(e){var a=e;return{date:o.l("%Y-%m-%dT%H:%M:%SZ")(a.datetime),sea_surface_wave_significant_height:t(a.sea_surface_wave_significant_height)?Number(a.sea_surface_wave_significant_height):0,air_temperature_at_2m_above_ground_level:Number(a.air_temperature_at_2m_above_ground_level),wind_from_direction_at_10m_above_ground_level:Number(a.wind_from_direction_at_10m_above_ground_level),wind_speed_at_10m_above_ground_level:Number(a.wind_speed_at_10m_above_ground_level)}})).then((function(i){var c=o.j().domain(o.f(i,(function(e){return e.date}))).range([0,a]);r.append("g").attr("transform","translate(0, ".concat(n,")")).call(o.b(c));var s=o.i().domain([0,o.h(i,(function(e){return t(e.sea_surface_wave_significant_height)?+e.sea_surface_wave_significant_height:0}))]).range([n,0]);r.append("g").call(o.c(s)),r.append("path").datum(i).attr("fill",e.fill).attr("stroke","white").attr("stroke-width",1.6).attr("d",o.a().curve(o.e).x((function(e){return c(e.date)})).y0(s(0)).y1((function(e){return s(e.sea_surface_wave_significant_height)})))}))};return Object(s.jsx)("div",{className:"seaSurfaceWave"})},_=a(3),f=a.n(_),d=a(22),l=(a(162),a(47)),m=a.n(l),p=function(e){var t=function(){var e=Object(d.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=[],e.next=3,m.a.get("./data.json");case 3:return a=e.sent,Object.keys(a.data).forEach((function(e){var n=e,r=a.data[e],i=r.sea_surface_wave_from_direction_at_variance_spectral_density_maximum||0,c=r.surface_sea_water_speed||0,s=r.sea_surface_wave_maximum_height||0,u={datetime:o.l("%Y-%m-%dT%H:%M:%SZ")(n)||new Date(0),sea_surface_wave_from_direction_at_variance_spectral_density_maximum:i,surface_sea_water_speed:c,sea_surface_wave_maximum_height:s};t.push(u)})),t.sort((function(e,t){return+new Date(e.datetime)-+new Date(t.datetime)})),e.abrupt("return",t);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(n.useEffect)((function(){return r(),function(){a()}}));var a=function(){o.k(".seaSurfaceWaterSpeed").selectChild("svg").remove()},r=function(){var a=Object(d.a)(f.a.mark((function a(){var n,r,i,c,s,u;return f.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return console.log("waterspeed draw!"),a.next=3,t();case 3:(n=a.sent).map((function(e){console.log(e.datetime.toISOString)})),r=e.width-e.left-e.right,i=e.height-e.top-e.bottom,c=o.k(".seaSurfaceWaterSpeed").append("svg").attr("width",r+e.left+e.right).attr("height",i+e.top+e.bottom).append("g").attr("transform","translate(".concat(e.left,",").concat(e.top,")")),s=o.j().domain(o.f(n,(function(e){return e.datetime}))).range([0,r]),c.append("g").attr("transform","translate(0, ".concat(i,")")).call(o.b(s)),u=o.i().domain([0,o.h(n,(function(e){return+e.surface_sea_water_speed}))]).range([i,0]),c.append("g").call(o.c(u)),c.append("path").datum(n).attr("fill","none").attr("stroke","black").attr("stroke-width",1.6).attr("d",o.g().x((function(e){return s(e.datetime)})).y((function(e){return u(e.surface_sea_water_speed)})));case 13:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}();return Object(s.jsx)("div",{className:"seaSurfaceWaterSpeed"})};var h=function(){return Object(s.jsxs)("div",{className:"App",children:[Object(s.jsx)(u,{width:1500,left:50,right:50,height:800,top:50,bottom:50,fill:"tomato"}),Object(s.jsx)(p,{width:1500,left:50,right:50,height:800,top:50,bottom:50,fill:"tomato"})]})},g=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,182)).then((function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,i=t.getLCP,c=t.getTTFB;a(e),n(e),r(e),i(e),c(e)}))};c.a.render(Object(s.jsx)(r.a.StrictMode,{children:Object(s.jsx)(h,{})}),document.getElementById("root")),g()}},[[181,1,2]]]);
//# sourceMappingURL=main.1c4a6742.chunk.js.map