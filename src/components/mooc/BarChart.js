import React, { Component } from 'react'
import * as d3 from 'd3'
import AuthenticationService from './AuthenticationService'
import FeedbackDataService from '../../api/feedback/FeedbackDataService'
import EnrolledDataService from '../../api/enrolled/EnrolledDataService'
import * as moment from 'moment'

class BarChart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            courseId: this.props.courseId,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            fromListCourseComponent: "",
            description: "",
            course: {},
            enrolled: [],
            enrolledId: "",
            instructorName: "",
            username: AuthenticationService.getLoggedInUserName(),
            relatedLessons: [],
            feedbackByCourseGroupedByLesson: [],
            feedbackStats: [],
        }

        // this.onSubmit = this.onSubmit.bind(this)
        // this.validate = this.validate.bind(this)
        // this.determineIfFromProfilePage = this.determineIfFromProfilePage.bind(this)
        // this.getAndParseFeedbackPeriods = this.getAndParseFeedbackPeriods.bind(this)
        // // this.returnD3Chart = this.returnD3Chart.bind(this)
        // this.drawChart = this.drawChart.bind(this)
        this.getAndParseRatings = this.getAndParseRatings.bind(this)
        this.getAndParseEnrolledStudents = this.getAndParseEnrolledStudents.bind(this)
        this.drawChartEnrollment = this.drawChartEnrollment.bind(this)
        this.drawChartRatings = this.drawChartRatings.bind(this)
    }
    componentDidMount() {
        console.log("bc" + this.state.startDate + " " + this.state.endDate)
        this.getAndParseRatings();

        this.getAndParseEnrolledStudents();
        // this.drawChart()
    }
    getAndParseRatings() {


     
        console.log("in barchart getfeedback")
        if (this.state.startDate === "" && this.state.endDate === "") {
            FeedbackDataService.retreieveFeedbackByCourseGroupedByLesson(this.state.courseId)
                .then(
                    response => {
                        if (response !== undefined) {
                            console.log("in getAndParseFeedbackPeriods: " + JSON.stringify(response.data))

                            this.setState({ feedbackByCourseGroupedByLesson: response.data }, () => {
                                var l = response.data

                                var g = []
                                //Iterate over sets of feedbacks for each lesson
                                for (var j = 0; j < l.length; j++) {
                                    //Iterate over all feedback for a lesson
                                    var lessonFeedbackStats = {}
                                    var oneCounter = 0;
                                    var twoCounter = 0;
                                    var threeCounter = 0;
                                    var sumCounter = 0;
                                    for (var k = 0; k < l[j].length; k++) {
                                        console.log("l[j][k]: " + JSON.stringify(l[j][k]));
                                        if (l[j][k].feedbackRating === 1) {
                                            oneCounter++
                                        } else if (l[j][k].feedbackRating === 2) {
                                            twoCounter++
                                        } else {
                                            // l[j][k].feedbackRating === 3
                                            threeCounter++
                                        }
                                        sumCounter = sumCounter + l[j][k].feedbackRating
                                    }

                                    let v = {
                                        "lessonId": l[j][0].lessonId,
                                        "oneCounter": oneCounter,
                                        "twoCounter": twoCounter,
                                        "threeCounter": threeCounter,
                                        "averageRating": sumCounter / l[j].length
                                    }

                                    g.push(v);
                                }


                                //Store feedback stats
                                this.setState({ feedbackStats: g }, () => {
                                    console.log("barchart this.state.feedbackStats:" + JSON.stringify(this.state.feedbackStats));
                                    this.drawChartRatings();

                                })





                            })



                        } else {

                        }
                    }
                )

        } else {
            FeedbackDataService.retreieveFeedbackByCourseGroupedByLessonByDates(this.state.courseId, this.state.startDate, this.state.endDate)
                .then(
                    response => {
                        if (response !== undefined) {
                            console.log("in retreieveFeedbackByCourseGroupedByLessonByDates: " + JSON.stringify(response.data))

                            this.setState({ feedbackByCourseGroupedByLesson: response.data }, () => {
                                var l = response.data

                                var g = []
                                //Iterate over sets of feedbacks for each lesson
                                for (var j = 0; j < l.length; j++) {
                                    //Iterate over all feedback for a lesson
                                    var lessonFeedbackStats = {}
                                    var oneCounter = 0;
                                    var twoCounter = 0;
                                    var threeCounter = 0;
                                    var sumCounter = 0;
                                    for (var k = 0; k < l[j].length; k++) {
                                        console.log("l[j][k]: " + JSON.stringify(l[j][k]));
                                        if (l[j][k].feedbackRating === 1) {
                                            oneCounter++
                                        } else if (l[j][k].feedbackRating === 2) {
                                            twoCounter++
                                        } else {
                                            // l[j][k].feedbackRating === 3
                                            threeCounter++
                                        }
                                        sumCounter = sumCounter + l[j][k].feedbackRating
                                    }

                                    let v = {
                                        "lessonId": l[j][0].lessonId,
                                        "oneCounter": oneCounter,
                                        "twoCounter": twoCounter,
                                        "threeCounter": threeCounter,
                                        "averageRating": sumCounter / l[j].length
                                    }

                                    g.push(v);
                                }


                                //Store feedback stats
                                this.setState({ feedbackStats: g }, () => {
                                    console.log("barchart this.state.feedbackStats:" + JSON.stringify(this.state.feedbackStats));
                                    this.drawChartRatings();

                                })





                            })



                        } else {

                        }
                    }
                )

        }

    }

    getAndParseEnrolledStudents() {

        EnrolledDataService.retrieveEnrolledByCourseId(this.state.courseId)
            .then(
                response => {
                    if (response.data != undefined) {

                        console.log("getAndParseEnrolledStudents: " + JSON.stringify(response.data))
                        this.setState({ enrolled: response.data },
                            () => {
                                // this.drawChartEnrollment()
                            })


                    } else {
                        console.log("Nobody enrolled yet")
                    }
                }
            )

    }

    drawChartEnrollment() {
        const maxBarHeight = 200
        const barChartWidth = 400
        //2nd barchart
        //Creating cumulative sum line chart of enrollments
        var ct = []
        for (var u = 0; u < this.state.enrolled.length; u++) {
            ct.push(1)
        }
        // console.log("ct:    " + ct)
        var cumsumEnrolled = d3.cumsum(ct)
        console.log("cumsumEnrolled: " + cumsumEnrolled)





        //2nd barchart
        var lineArr = []
        for (var u = 0; u < this.state.enrolled.length; u++) {
            var f = this.state.enrolled[u].enrolledTimestamp;
            f = f.substring(5, 10);
            lineArr.push({
                "date": f,
                "cusumEnrolled": cumsumEnrolled[u]
            })
        }

        console.log("lineArr: " + JSON.stringify(lineArr))



        const svg2 = d3.select(".classEnrollment").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr('class', 'ratings');

        svg2.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(10,200) rotate(270)')
            .attr('font-size', "15px")
            .text('enrollments');

        svg2.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(200,260)')
            .attr('font-size', "15px")
            .text('Date');


        const barGroup2 = svg2.append('g')
            .attr('transform', 'translate(' + 50 + ',' + 20 + ')')




        const x2 = d3.scaleBand()
            .range([0, barChartWidth])
            .domain(lineArr.map(d => d.date))
            .padding(0.2);

        let yMax2 = d3.max(lineArr.map(d => +d.cusumEnrolled))

        const y2 = d3.scaleLinear()
            .domain([0, yMax2])
            //svg goes from top to bottom
            .range([maxBarHeight, 0]);


        let barchart2 = barGroup2.selectAll(".enrollmentBar")
            .data(lineArr)
            .enter()
            .append("rect")
            .attr('class', 'enrollmentBar')
            .attr("x", d => x2(d.date))
            .attr("y", d => y2(d.cusumEnrolled))
            .attr("width", x2.bandwidth())
            .attr("height", d => maxBarHeight - y2(d.cusumEnrolled))
            .attr("fill", "#69b3a2")


        //Adding axes
        // //add x axis 

        barGroup2.append("g")
            //pushes x-axis form top to bottom
            .attr("transform", `translate(0, ${maxBarHeight})`)
            .call(d3.axisBottom(x2))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // // add y axis

        barGroup2.append("g")
            .call(d3.axisLeft(y2));









        // //adding tooltip
        let barTooltip = barGroup2.append("text") // we append simple text as a tooltip
            .attr('x', 0) // the initial position of the tooltip
            .attr('y', 0)
            .style('font-size', 16)
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .style("visibility", "hidden")  // hide it initially






        barchart2
            .on('mouseover', function (event, d) {   // now we need to use the second variable, the data
                //Must always put event first bcs always treat first var as event and 2nd as data
                // console.log("hover: "+ event, d)
                console.log("hover: " + JSON.stringify(d))
                var date = d[0]

                //tooltip
                barTooltip
                    .style('visibility', 'visible') // make it visible
                    .text(`Date: ${d["date"]}` + ` Enrolled: ${d["cusumEnrolled"]}`) // adding text based on the data  // .text(`${d[0]}:` + `${date}`) 
                    // .attr('x', x2(d[0]) + x.bandwidth() / 2) // move the tooltip to its corresponding bar 
                    .attr('x', 100)
                    .attr('y', y2(d[1]) - 5) // move the tooltip near the top of the bar


                //Highlighting
                d3.selectAll('.enrollmentBar')   // select all the bars in this class
                    .style('opacity', 0.1)  // set their opacity to a small number

                d3.select(this)         // select the one you hovered on
                    .style('opacity', 1)




            })
            .on('mouseout', function (event, d) {

                //tooltip
                barTooltip.style('visibility', 'hidden') // when you mouse leaves, hide the tooltip

                //Highlighting
                d3.selectAll('.enrollmentBar') // select all the bars in this class
                    .style('opacity', 1) // set its opacity to their original opacity



                // var states = ["California", "Colorado", "Florida", "Georgia", "Indiana"]
                // for (var i = 0; i < states.length; i++) {
                //     // if (states[i] !== d[0]) {
                //     //     var stateLine = "#" + states[i].toLowerCase() + "Line"
                //     //     // console.log("this is stateLine: " + stateLine)
                //     //     d3.select(stateLine)  // select the circle by its ID
                //     //         .style('visibility', 'hidden')   // change the color

                //     // }
                //     var stateLine = "#" + states[i].toLowerCase() + "Line"
                //     // console.log("this is stateLine: " + stateLine)
                //     d3.select(stateLine)  // select the circle by its ID
                //         .style('visibility', 'visible')   // change the color
                // }
            })

    }
    drawChartRatings() {
        // console.log(this.props.data)

        // const dataFromProps = this.props.data;
        // console.log("dataFromProps:" + JSON.stringify(dataFromProps))
        var dataFromProps = this.state.feedbackStats

        var oneCounter = 0
        var twoCounter = 0
        var threeCounter = 0
        for (var i = 0; i < dataFromProps.length; i++) {
            console.log("oneCounter + dataFromProps[i].oneCounter: " + oneCounter + dataFromProps[i].oneCounter)
            oneCounter = oneCounter + dataFromProps[i].oneCounter
            twoCounter = twoCounter + dataFromProps[i].twoCounter
            threeCounter = threeCounter + dataFromProps[i].threeCounter
        }

        console.log("feedbackStats in barchart:" + JSON.stringify(this.state.feedbackStats))
        var data = [{ "counterType": "1", "value": oneCounter },
        { "counterType": "2", "value": twoCounter }
            , { "counterType": "3", "value": threeCounter }]

        console.log("barchart data:" + JSON.stringify(data))

        d3.selectAll("svg").remove();

        const svg = d3.select(".ratingsHistogram").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr('class', 'ratings');

        svg.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(10,200) rotate(270)')
            .attr('font-size', "15px")
            .text('Number of rating type');

        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(200,260)')
            .attr('font-size', "15px")
            .text('Rating type');


        const maxBarHeight = 200
        const barChartWidth = 400

        let barGroup = svg.append('g')
            .attr('transform', 'translate(' + 50 + ',' + 20 + ')')



        //solution
        const x = d3.scaleBand()
            .range([0, barChartWidth])
            .domain(data.map(d => d.counterType))
            .padding(0.2);

        let yMax = d3.max(data.map(d => +d.value))

        const y = d3.scaleLinear()
            .domain([0, yMax])
            //svg goes from top to bottom
            .range([maxBarHeight, 0]);


        barGroup.selectAll(".myBar")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', 'myBar')
            .attr("x", d => x(d.counterType))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => maxBarHeight - y(d.value))
            .attr("fill", "#69b3a2")


        //Adding axes
        // //add x axis 

        barGroup.append("g")
            //pushes x-axis form top to bottom
            .attr("transform", `translate(0, ${maxBarHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // // add y axis

        barGroup.append("g")
            .call(d3.axisLeft(y));

        // svg.selectAll("rect")
        //     .data(data)
        //     .enter()
        //     .append("rect")
        //     .attr("x", (d, i) => i * 70)
        //     .attr("y", (d, i) => 300 - 10 * d)
        //     .attr("width", 65)
        //     .attr("height", (d, i) => d * 10)
        //     .attr("fill", "green");


        // svg.selectAll("text")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .text((d) => d)
        //     .attr("x", (d, i) => i * 70)
        //     .attr("y", (d, i) => 300 - (10 * d) - 3)

        this.drawChartEnrollment()

    }
    setDate(data) {
        console.log("this.state.date: " + data)
        var dayPlusOne = Number(data.substring(8, data.length)) + 1
        console.log("dayPlusOne: " + dayPlusOne)
        var dataCorrected = data.substring(0, 8) + dayPlusOne.toString()
        console.log("dataCorrected:" + dataCorrected)
        console.log("moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ') " + moment(new Date(dataCorrected)).format('YYYY-MM-DDTHH:mm:ss.sssZ'))

        return moment(new Date(dataCorrected)).format('YYYY-MM-DDTHH:mm:ss.sssZ')
    }
    render() {
        return (<div id={"#" + this.props.id}>

            {/* {d3.select(".filterFeedback").remove()}
            {<form className="filterFeedback">
                <div>Filter feedback (start/end date)</div>
                <input type="date" id="start" name="feedback-start" onChange={(event) => this.setState({ startDate: this.setDate(event.target.value) }, () => {
                    this.filterFeedbackAndEnrollData()
                    console.log("this.state.startDate" + this.state.startDate)
                })} />
                <input type="date" id="end" name="feedback-start" onChange={(event) => this.setState({ endDate: this.setDate(event.target.value) }, () => {
                    this.filterFeedbackAndEnrollData()
                    console.log("this.state.endDate" + this.state.endDate)
                })} />
            </form>
            } */}



        </div>)
    }
}

export default BarChart;







{
    //line chart basic

    // test = d3.rollup(data, v => d3.mean(v, d => d.FertilityRate), d => d.Year)

    // console.log(test)
    // console.log(typeof test)

    // testObjArr = []
    // for (const testElement of test) {
    //     testObjArr.push(
    //         { "Year": testElement[0], "FertilityRateAvg": testElement[1] }
    //     );

    //     // console.log(testObjArr[0]["Country"])

    // }
    // console.log(testObjArr)
    // var lineArr = []
    // for (var u = 0; u < this.state.enrolled.length; u++) {
    //     lineArr.push({
    //         "date": this.state.enrolled[u].enrolledTimestamp,
    //         "cusumEnrolled": cumsumEnrolled[u]
    //     })
    // }

    // console.log("lineArr: " + JSON.stringify(lineArr))


    // const svg2 = d3.select(".classEnrollment").append("svg")
    //     .attr("width", this.props.width)
    //     .attr("height", this.props.height)
    //     .attr('class', 'ratings');
    // const lineChartWidth = 300, lineChartHeight = 200


    // let lineGroup = svg2.append('g')
    //     .attr('transform', 'translate(' + 50 + ',' + 50  + ')')

    // // Add X axis --> it is a date format
    // const xScale2 = d3.scaleTime()
    //     //.domain maps each data item (in this case a time unit (ordinal data) to a point in the 
    //     //line chart width), similar like mapping colour and categories of nominal data in vega-lite.
    //     .domain(d3.extent(lineArr, function (d) { return d.date; }))
    //     .range([0, lineChartWidth]);
    // lineGroup.append("g")
    //     .attr("transform", `translate(0, ${lineChartHeight})`)
    //     .call(d3.axisBottom(xScale2));
    // // Add Y axis
    // const yScale2 = d3.scaleLinear()
    //     //.domain does same here like xScale, but in top-bottom direction
    //     //so range starts from lineChartHeight instead of 0, and goes opposite direction
    //     .domain([0, d3.max(lineArr, function (d) { return +d.cusumEnrolled; })])
    //     .range([lineChartHeight, 0]);
    // lineGroup.append("g")
    //     .call(d3.axisLeft(yScale2));




    // //create a d3 line

    // //d3.line connects x y points
    // let line = d3.line()
    //     .x(d => xScale2(d.date))
    //     .y(d => yScale2(d.cusumEnrolled))


    // // Add the line
    // // console.log("line: " + line)

    // lineGroup.append("path")
    //     //see slides for difference between datum(data) or data(data)
    //     .datum(lineArr)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line)



    //Enrolled line chart
    // https://stackoverflow.com/questions/69555979/how-to-cumulate-d3-rollup-data-by-year
    //https://observablehq.com/@d3/d3-cumsum
    // data = {
    //     const sortedData = rawdata.sort((a, b) => d3.ascending(a.date, b.date));

    //     // rollups returns arrays of key-value pairs instead of a map
    //     const groupByYearDate = d3.rollups(
    //         sortedData,
    //         (v) => d3.sum(v, (d) => d.value),
    //         (d) => d.date.getFullYear(),
    //         (d) => d.date
    //     );

    //     return new Map(
    //         // for each year
    //         groupByYearDate.map(([year, values]) => {
    //             // summed is an array of numbers
    //             const summed = d3.cumsum(values, d => d[1]);
    //             // dates is an array of dates
    //             const dates = values.map(d => d[0]);
    //             // zip them together
    //             const combined = d3.zip(dates, summed);
    //             return [year, new Map(combined)]
    //         })
    //     );
    // }



    // const sortedData = this.state.enrolled.sort((a, b) => d3.ascending(a.date, b.date));
    // const groupByYearDate = d3.rollups(
    //     this.state.enrolled,
    //     (v) => d3.sum(v, (d) => d.value),
    //     (d) => d.enrolledTimestamp,
    //     (d) => d.date
    // );

    // console.log("groupByYearDate: " + groupByYearDate)

    // var p = new Map(
    //     // for each year
    //     groupByYearDate.map(([year, values]) => {
    //         // summed is an array of numbers
    //         const summed = d3.cumsum(values, d => d[1]);
    //         // dates is an array of dates
    //         const dates = values.map(d => d[0]);
    //         // zip them together
    //         const combined = d3.zip(dates, summed);
    //         return [year, new Map(combined)]
    //     })
    // );
    // console.log("p: " + p)



    //2nd barchart

    // const svg2 = d3.select(".classEnrollment").append("svg")
    //     .attr("width", this.props.width)
    //     .attr("height", this.props.height)
    //     .attr('class', 'ratings');

    // svg2.append('text')
    //     .attr('class', 'label')
    //     .attr('transform', 'translate(10,200) rotate(270)')
    //     .attr('font-size', "15px")
    //     .text('Number of rating type');

    // svg2.append('text')
    //     .attr('class', 'title')
    //     .attr('transform', 'translate(200,260)')
    //     .attr('font-size', "15px")
    //     .text('Rating type');


    // const barGroup2 = svg2.append('g')
    //     .attr('transform', 'translate(' + 50 + ',' + 20 + ')')



    // //solution
    // const x2 = d3.scaleBand()
    //     .range([0, barChartWidth])
    //     .domain(data.map(d => d.counterType))
    //     .padding(0.2);

    // let yMax2 = d3.max(data.map(d => +d.value))

    // const y2 = d3.scaleLinear()
    //     .domain([0, yMax])
    //     //svg goes from top to bottom
    //     .range([maxBarHeight, 0]);


    // barGroup2.selectAll(".myBar")
    //     .data(data)
    //     .enter()
    //     .append("rect")
    //     .attr('class', 'myBar')
    //     .attr("x", d => x2(d.counterType))
    //     .attr("y", d => y2(d.value))
    //     .attr("width", x2.bandwidth())
    //     .attr("height", d => maxBarHeight - y2(d.value))
    //     .attr("fill", "#69b3a2")


    // //Adding axes
    // // //add x axis 

    // barGroup2.append("g")
    //     //pushes x-axis form top to bottom
    //     .attr("transform", `translate(0, ${maxBarHeight})`)
    //     .call(d3.axisBottom(x2))
    //     .selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");

    // // // add y axis

    // barGroup.append("g")
    //     .call(d3.axisLeft(y2));

}