$(document).ready(function(){
  (function (d3) {
    'use strict';

    var width = $('#graph-container').width();
    var height = $('#graph-container').height();
    var radius = width / 2 - 100;
    var mycolor = d3.scaleOrdinal(["#1F77B4", "#AEC7E8", "#913A3C", "#FFBB78", "#2CA02C", "#98DF8A", "#D62728", "#FF9896", "#9467BD", "#C5B0D5", "#8C564B", "#C49C94", "#E377C2", "#F7B6D2", "#7F7F7F", "#C7C7C7", "#BCBD22", "#DBDB8D", "#17BECF", "#9EDAE5"]);
    const rootColor = '#FF7F0E';
    var isDescOn = false;

    // var mycolor = d3.scaleOrdinal(d3.schemeCategory10);
    //for ellipse
    const radX = 50;
    const radY = 40;
    var currentDepth = 0;

    const svg = d3.select('#graph-container')
                   .append("div")
                   .classed("svg-container", true) 
                   .append("svg")
                   .attr("id", "my-portal-graph")
                   // Responsive SVG needs these 2 attributes and no width and height attr.
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "0 0 "+ width +" "+ height)
                   // Class to make it responsive.
                   .classed("svg-content-responsive", true)
                   // Fill with a rectangle for visualization.
                   .attr("width", width)
                   .attr("height", height);

    const margin = { top: 0, right: 25, bottom: 0, left: 25};
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    //assign layout
    const radialLayout = d3.cluster()
          .size([2 * Math.PI, radius])

    const zoomG = svg
                    .attr('width', width)
                    .attr('height', height)
                    .append('g');
    var root = null;


    //group to handle zoom
    const g = zoomG.append('g')
      // .attr('transform', `translate(${margin.left},${margin.top})`)

    //group for nodes and links
    const gLink = g.append("g")
                   .attr("fill", "none")
                   .attr("stroke", "#555")
                   .attr("stroke-opacity", 0.4)
                   .attr("stroke-width", 1.5);

    const gNode = g.append("g")
                   .attr('id', 'nodes-group')
                   .attr("cursor", "pointer")
                   .attr("pointer-events", "all");

    svg.call(d3.zoom().on('zoom', () => {
        zoomG.attr('transform', d3.event.transform);
    })).on("dblclick.zoom", null); //to disable double click zoom .on("dblclick.zoom", null)

    //load data
    d3.json('data.json')
    .then(data => {

        //just add colors here and do accordingly
        var colorData = data;
        colorData.color = rootColor; //for root node
        var level = 0;

        colorChild(colorData, level, getColor);

        //create root
        root = d3.hierarchy(colorData);

        root.x0 = width / 12;
        root.y0 = 0;
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            // console.log(d.depth);
            if (d.depth > 1) d.children = null;
        });
        console.log(data);
        updateLayout(root);

        var rootData = data.data
        generateDescription(rootData)
    });


    function updateLayout(source){
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // console.log(source);
        // Compute the new radial layout.
        radialLayout(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
                              .duration(duration)
                              .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                              .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));


        // var descendants = root.descendants();


        var node = gNode.selectAll("g")
                        .data(nodes, d => d.id)

        const nodeEnter = node.enter().append("g")
                                        .attr("transform", d => {
                                            return "translate(" + project(source.x0, source.y0) + ")";
                                        })
                                        .attr("fill-opacity", 0)
                                        .attr("stroke-opacity", 0)
                                        .on("mouseover", handleMouseOver)
                                        .on("mouseout", handleMouseOut);


        nodeEnter.append("ellipse")
                 .attr("class", "my-nodes")
                 .attr("class", d => d._children ? "node-w-children" : "")
                 .attr('rx', d => radX - d.depth*5)
                 .attr('ry', d => radY - d.depth*3)
                 .attr("fill", function(d) { return d.data.color; })
                 .attr("stroke", d => d3.hcl(d.data.color).darker())
                 .attr("stroke-width", d => d._children ? 3 : 0)
                 .attr('data-fulltext', d => d.data.data.id)
                 .on("click", function(d){ 
                   generateDescription(d.data.data);
                 })
                 .on("dblclick", d => {
                    if(d.depth > 0){
                        d.children = d.children ? null : d._children;
                        updateLayout(d);
                        // g.attr('transform', `translate(${innerWidth/4},${innerHeight/4}) scale(${0.5})`);
                    }
                 });
        nodeEnter.append("text")
                 .attr("dy", "0.31em")
                 .attr("text-anchor", d => d._children ? "end" : "start")
                 .text(d => d.data.data.id )
                 .attr("text-anchor", 'middle')
                 .attr("font-size", d => (18 - d.depth*1.5) + 'px')
                 .call(wrap, d => radX - d.depth*5);


        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
                               .attr("transform", d => {
                                    return "translate(" + project(d.x, d.y) + ")";
                                })
                               .attr("fill-opacity", 1)
                               .attr("stroke-opacity", 1);
        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
                             .attr("transform", d => {
                                    return "translate(" + project(source.x0, source.y0) + ")";
                              })
                             .attr("fill-opacity", 0)
                             .attr("stroke-opacity", 0)
                             .call(handleMouseOut)
                             .remove();


        // FOR LINKS

         // Update the links…
        const link = gLink.selectAll("path")
                            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
                                .attr("class", "link")
                                .attr("stroke", function(d){
                                  if(d.target != null){
                                    return d.target.data.color;
                                  }
                                })
                                .attr("d", d => {
                                  const o = {x: source.x0, y: source.y0};
                                  return diagonal({source: o, target: o});
                                });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
              const o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            });



        root.eachBefore(d => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
    }
    
    var diagonal = d3.linkHorizontal().x(d => {
        return width / 2 + d.y * Math.sin(d.x);
    }).y(d => {
        return height / 2 + d.y * Math.cos(d.x) + 4;
    })

    function project(theta, r){
      return [
        width / 2 + r * Math.sin(theta),
        height / 2 + r * Math.cos(theta) + 4
      ]
    }

    //generate color for nodes

    function getColor(color, level, idx=0){
      var retColor = null;
      if(level == 0){
        retColor = rootColor;
      } else if(level == 1){
        retColor = mycolor(idx);
      } else{
        retColor = color(idx);
      }
      return retColor;
    }

    function scaleColor(color, len){
      var startColor = d3.hcl(color)
                        .darker(),
        endColor   = d3.hcl(color)
                        .brighter();
      var childColor = d3.scaleLinear()
                  .interpolate(d3.interpolateHcl)
                  .range([
                      startColor.toString(),
                      endColor.toString()
                  ])
                  .domain([0, len]);
      return childColor;
    }

    function colorChild(data, lvl, func){
      if (data.hasOwnProperty('children')){
        data.children.forEach(function (child, idx) {
          if(idx==0){lvl++;}
          var tempColor = mycolor;
          if (lvl>1) {
            tempColor = scaleColor(data.color, data.children.length+1);
          }
          child.color = func.apply(this, [tempColor, lvl, idx]);
          colorChild(child, lvl, func);
          // console.log(child.data.id + ' lvl : ' + lvl)
        });   
      }
    }

    //to wrap text inside ellipse
    function wrap(text, width){
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/),
            line1 = words[0].substring(0, 12),
            line2,
            x = 0,
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");

            tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", "0em")
                          .text(line1);

        if(words.length>1){
          if(words[1].length > 12){
            line2 = words[1].substring(0, 11) + '...';
          } else if(words.length>2){
            line2 = words[1].substring(0, 11)+ '...';
          } else{
            line2 = words[1];
          }
          text.attr("transform", "translate(0, -5)");
          tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", "1.1em")
                        .text(line2);
        }
      });
    };

    // Create Event Handlers for mouse
    function handleMouseOver(d, i, element) {  // Add interactivity
        
        var x = d3.event.pageX + 'px';
        var y = d3.event.pageY + 'px';
        var ellip = d3.select(this).select('ellipse');
        var $temp = $("<p />").addClass('hover_text');
        $temp.html(ellip.attr('data-fulltext'));

        $.when( $("body").append($temp) ).done(function() {
          $('.hover_text').css( { left: x, top: y } );
        });
    }

    function handleMouseOut(d, i) {// Add interactivity
        var ellip = d3.select(this).select('ellipse');
        // ellip.attr("fill", 'lime');
        $('.hover_text').remove();
    }

    function generateDescription(myData){
      var descHTML = $('#createDescription').html();
      var descTemplate = Handlebars.compile(descHTML);
      var descData = descTemplate(myData);

      $.when($('#details-box').html(descData)).done(function(){
      });
    }
    //make responsive
    function resizeSVG(showDesc){
      width = $('#graph-container').width();
      height = $('#graph-container').height();
      radius = width / 2 - 100;
      innerWidth = width - margin.left - margin.right;
      innerHeight = height - margin.top - margin.bottom;
      svg.attr("width", width)
         .attr("height", height);
      radialLayout.size([2 * Math.PI, radius])
      zoomG.attr("width", width)
           .attr("height", height);      
        // g.attr('transform', `translate(${innerWidth/4},${innerHeight/4}) scale(${0.5})`);
    }
    d3.select(window).on('resize.updatesvg', function(){ resizeSVG(isDescOn) });
    //close button function
    $("#close-details").on("click", function(){
      isDescOn = false;
      $("#details-container").hide(0);
      resizeSVG(isDescOn);
    });

  }(d3));
});
