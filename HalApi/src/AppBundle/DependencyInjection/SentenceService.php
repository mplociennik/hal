<?php

namespace AppBundle\DependencyInjection;


use AppBundle\Entity\Sentence;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\Container;

class SentenceService
{

	/**
	 * @var EntityManager
	 */
	private $em;

	public function __construct(EntityManager $entityManager, Container $container)
	{
		$this->em = $entityManager;
		$this->container = $container;
	}

	public function findOrCreate(string $sentence): Sentence
	{
		$sentence = $this->prepareSentence($sentence);


		return $sentence;
	}

	private function prepareSentence(string $sentence): Sentence
	{
		$sentence = new Sentence();

		$words = $this->prepareSentenceWords($sentence);
		$sentence->setWords($words);
		$sentence->setCreatedAt(new \DateTime());
		$sentence->setUpdatedAt(new \DateTime());

		return $sentence;
	}

	private function prepareSentenceWords($sentence): ArrayCollection
	{
		$wordService = $this->container->get('app.word_service');
		$words = new ArrayCollection();
		foreach ($this->sentenceToWordsArray($sentence) as $word) {
			$word = $wordService->findOrCreate($word);
			$words->add($word);
		}

		return $words;
	}

	private function sentenceToWordsArray(string $sentence): array
	{
		return preg_split("/\s+/", $sentence);
	}
}