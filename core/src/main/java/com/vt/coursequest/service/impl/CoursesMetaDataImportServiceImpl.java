package com.vt.coursequest.service.impl;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.HeaderColumnNameTranslateMappingStrategy;
import com.vt.coursequest.dao.CourseCRNsRepository;
import com.vt.coursequest.dao.CourseRepository;
import com.vt.coursequest.dao.DegreeRepository;
import com.vt.coursequest.dao.DepartmentRepository;
import com.vt.coursequest.dao.InstructorRepository;
import com.vt.coursequest.dao.LevelRepository;
import com.vt.coursequest.dao.UniversityRepository;
import com.vt.coursequest.entity.Course;
import com.vt.coursequest.entity.CourseCRN;
import com.vt.coursequest.entity.Degree;
import com.vt.coursequest.entity.Department;
import com.vt.coursequest.entity.Instructor;
import com.vt.coursequest.entity.Level;
import com.vt.coursequest.entity.University;
import com.vt.coursequest.importdata.bean.CourseMetaData;
import com.vt.coursequest.service.CoursesMetaDataImportService;

@Service
public class CoursesMetaDataImportServiceImpl implements CoursesMetaDataImportService {

	@Autowired
	private Environment environment;

	@Resource
	private CourseRepository courseRepository;

	@Resource
	private UniversityRepository universityRepository;

	@Resource
	private DegreeRepository degreeRepository;

	@Resource
	private LevelRepository levelRepository;

	@Resource
	private DepartmentRepository deptRepository;

	@Resource
	private InstructorRepository instructorRepository;

	@Resource
	private CourseCRNsRepository courseCRNsRepository;

	@Override
	public void importCourseMetaData(Integer universityId, boolean isFullImport) throws IOException {

		String fileName = environment.getProperty("application.metadata-file-path");
		Map<String, String> mapping = new HashMap<>(); // csv columnname as key and CourseMetaData property name as
														// value
		mapping.put("Term", "term");
		mapping.put("Course No.", "courseNo");
		mapping.put("Course Title", "courseTitle");
		mapping.put("Instructor", "instructor");
		mapping.put("CRN", "crn");
		mapping.put("Credits", "credits");
		mapping.put("Subject", "dept");

		// HeaderColumnNameTranslateMappingStrategy
		// for Student class
		HeaderColumnNameTranslateMappingStrategy<CourseMetaData> strategy = new HeaderColumnNameTranslateMappingStrategy<CourseMetaData>();
		strategy.setType(CourseMetaData.class);
		strategy.setColumnMapping(mapping);
		// Create csvtobean and csvreader object
		CSVReader csvReader = null;
		try {
			csvReader = new CSVReader(new FileReader(fileName));

			CsvToBean<CourseMetaData> csvToBean = new CsvToBean<>();
			csvToBean.setCsvReader(csvReader);
			csvToBean.setMappingStrategy(strategy);
			// call the parse method of CsvToBean
			// pass strategy, csvReader to parse method
			List<CourseMetaData> exhaustiveList = csvToBean.parse();
			correctlyParseItAndSaveInDB(exhaustiveList, universityId);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}

	private void correctlyParseItAndSaveInDB(List<CourseMetaData> exhaustiveList, int universityId) {
		for (CourseMetaData metaCourseData : exhaustiveList) {
			Optional<Department> optionalDept = deptRepository.findByNameAndUniversityId(metaCourseData.getDept(),
					universityId);
			Optional<Course> optionalCourse = null;
			if (optionalDept.isPresent()) {
				optionalCourse = courseRepository.findByCourseNumAndDeptId(metaCourseData.getCourseNo(),
						optionalDept.get().getId());
			}
			Course existingCourse = null;
			if (optionalCourse.isPresent()) {
				existingCourse = optionalCourse.get();
			} else {
				Course newCourse = new Course();
				newCourse.setCourseNum(metaCourseData.getCourseNo());
				newCourse.setName(metaCourseData.getCourseTitle());
				existingCourse = courseRepository.save(newCourse);
			}

			existingCourse.setCourseNum(metaCourseData.getCourseNo());
			Degree degree = getDegree(metaCourseData.getCourseNo());
			if (null != degree) {
				Optional<Degree> optionalDegree = degreeRepository.findByName(degree.getName());
				if (optionalDegree.isPresent()) {
					existingCourse.setDegree(optionalDegree.get());
				} else {
					existingCourse.setDegree(degreeRepository.save(degree));
				}

			}

			String level = findLevel(metaCourseData.getCourseNo());
			if (null != level) {
				Optional<Level> optionalLevel = levelRepository.findByNameAndUniversityId(level, universityId);
				if (optionalLevel.isPresent()) {
					existingCourse.setLevel(optionalLevel.get());
				} else {
					existingCourse.setLevel(levelRepository.save(new Level(level, existingCourse.getUniversity())));
				}
			}

			if (optionalDept.isPresent()) {
				existingCourse.setDept(optionalDept.get());
			} else {
				existingCourse.setDept(
						deptRepository.save(new Department(metaCourseData.getDept(), existingCourse.getUniversity())));
			}

			existingCourse.setName(metaCourseData.getCourseTitle());

			Optional<University> uni = universityRepository.findById(universityId);
			if (uni.isPresent()) {
				existingCourse.setUniversity(uni.get());
			}

			Optional<CourseCRN> optionalCRN = courseCRNsRepository.findByCrnNumber(metaCourseData.getCrn());
			if (!optionalCRN.isPresent()) {
				CourseCRN crn1 = courseCRNsRepository.save(new CourseCRN(metaCourseData.getCrn()));
				existingCourse.getCourseCRNs().add(crn1);
			} else {
				existingCourse.getCourseCRNs().add(optionalCRN.get());
			}

			Optional<Instructor> optionalInstructor = instructorRepository.findByName(metaCourseData.getInstructor());

			if (!optionalInstructor.isPresent()) {
				Instructor instructor = instructorRepository.save(new Instructor(metaCourseData.getInstructor()));
				existingCourse.getInstructor().add(instructor);
			} else {
				existingCourse.getInstructor().add(optionalInstructor.get());
			}
			courseRepository.save(existingCourse);
		}
	}

	private String findLevel(String courseNo) {
		Integer num = (Integer.valueOf(courseNo) / 1000) * 1000;
		return num.toString();
	}

	private Degree getDegree(String courseNo) {

		String degreeName = environment.getProperty("application.labels.degreetypes.phd");
		if (Integer.valueOf(courseNo) <= 4000) {
			degreeName = environment.getProperty("application.labels.degreetypes.ug");
		} else if (Integer.valueOf(courseNo) <= 5000) {
			degreeName = environment.getProperty("application.labels.degreetypes.pg");
		}
		return new Degree(degreeName);
	}

	@Override
	public void scrapCourseDescriptionMetaData(Integer universityId, boolean isFullImport) throws IOException {
		// String[] urlPaths = environment.getProperty("application.webscraping.urls",
		// String[].class);
		// System.out.println(urlPaths);
		List<String> urlsToBeScraped = new ArrayList<>();
		urlsToBeScraped.add("https://cs.vt.edu/Undergraduate/courses.html");

		// parse all the urls
		for (String url : urlsToBeScraped) {
			Document document = Jsoup.connect(url).get();
			// System.out.println(document.title());
			Elements links = document.select("div.vt-vtcontainer-content").select("#text_1026503307_294568169")
					.select("ul li a");
			Iterator<Element> itr = links.iterator();
			while (itr.hasNext()) {
				Element aTag = itr.next();
				System.out.println(aTag.text());
				System.out.println(aTag.attr("href"));
			}

			// System.out.println(links);
		}

	}

	public static void main(String[] args) {
		CoursesMetaDataImportServiceImpl c = new CoursesMetaDataImportServiceImpl();
		try {
			c.scrapCourseDescriptionMetaData(1, true);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
