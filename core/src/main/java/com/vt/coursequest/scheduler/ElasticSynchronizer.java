package com.vt.coursequest.scheduler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vt.coursequest.dao.CourseRepository;
import com.vt.coursequest.dao.UniversityRepository;
import com.vt.coursequest.elasticsearch.dao.ICourseESRepository;
import com.vt.coursequest.elasticsearch.model.CourseModel;
import com.vt.coursequest.entity.Course;
import com.vt.coursequest.entity.University;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.DeleteIndexRequest;
import co.elastic.clients.elasticsearch.indices.ExistsRequest;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ElasticSynchronizer {

	@Autowired
	ICourseESRepository courseESRepo;

	@Autowired
	CourseRepository courseRepo;

	@Autowired
	UniversityRepository uniRepo;

	@Autowired
	ElasticsearchClient esClient;

	// Fields

	// Constructor

	@Scheduled(cron = "0 */3 * * * *")
	@Transactional
	public void sync() {
		log.info("Start Syncing - {}", LocalDateTime.now());
		this.syncCourses(1);
		log.info(" End Syncing - {}", LocalDateTime.now());
	}

	private void syncCourses(Integer universityId) {
		Optional<University> uni = uniRepo.findById(universityId);
		if (uni.isPresent()) {
			University university = uni.get();

			List<Course> courseList = new ArrayList<>();
			courseList = courseRepo.findAll();
			try {
				recreateIndices(true);
				indexCoursesData(university, courseList);
			} catch (ElasticsearchException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	private void indexCoursesData(University university, List<Course> courseList)
			throws ElasticsearchException, IOException {

//		UniversityModel um = new UniversityModel();
//		um.setId(university.getId());
//		um.setName(university.getName());
//		esClient.index(i -> i.index("university").id(university.getId().toString()).document(um));

		for (Course course : courseList) {

//			DeptModel deptModel = new DeptModel();
//			deptModel.setName(course.getDept().getName());
//			deptModel.setId(course.getDept().getId());
//			deptModel.setRelation(new JoinField<>("university"));
			// esClient.index(i ->
			// i.index("dept").id(course.getDept().getId().toString()).document(deptModel));
			CourseModel courseModel = new CourseModel();
			// courseModel.setRelation(new JoinField<>("dept"));
			courseModel.setCourseName(course.getName());
			courseModel.setCourseNum(course.getCourseNum());
			courseModel.setDesc(course.getDescription());
			courseModel.setUniversityId(course.getUniversity().getId());
			Set<String> crns = new HashSet<>();
			crns.addAll(
					course.getCourseCRNs().stream().map(crnObj -> crnObj.getCrnNumber()).collect(Collectors.toList()));
			Set<String> instructors = new HashSet<>();
			instructors.addAll(
					course.getInstructor().stream().map(instObj -> instObj.getName()).collect(Collectors.toList()));
			courseModel.setInstructors(instructors);
			courseModel.setCrns(crns);
			courseModel.setUniversityName(course.getUniversity().getName());
			courseModel.setDept(course.getDept().getName());
			courseModel.setDegree(course.getDegree().getName());
			IndexResponse response = esClient
					.index(i -> i.index("course").id(course.getCourseNum()).document(courseModel));

			log.info("ES  : " + response + "...");

		}
	}

	private void recreateIndices(final boolean deleteExisting) throws ElasticsearchException, IOException {
		String[] indices = { "course" };
		for (String indexName : indices) {
			boolean indexExists = esClient.indices().exists(ExistsRequest.of(e -> e.index(indexName))).value();
			if (!indexExists || deleteExisting) {
				if (deleteExisting) {
					esClient.indices().delete(new DeleteIndexRequest.Builder().index(indexName).build());
				}
				CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(indexName).build();
				esClient.indices().create(createIndexRequest);
			}
		}

	}

}